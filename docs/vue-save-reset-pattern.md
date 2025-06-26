# Vue.js 컴포넌트 간 Save/Reset 패턴 가이드

## 📖 개요

이 문서는 Vue.js에서 상위-하위 컴포넌트 간의 안정적이고 효율적인 데이터 편집/저장/리셋 패턴을 설명합니다. VehicleDetailList와 App.vue의 구현을 기반으로 다른 컴포넌트에도 확장 가능한 패턴을 제시합니다.

## 🏗️ 전체 아키텍처

### 데이터 흐름
```
원본 JSON 데이터 → totalRouteObject(불변) → selectedVehicles(편집용) → UI 표시
                                                      ↓
                                               변경사항 감지
                                                      ↓
                                            Save/Reset/복원 로직
```

### 핵심 설계 원칙
1. **불변성 보장**: 원본 데이터는 절대 변경하지 않음
2. **단방향 데이터 흐름**: 이벤트 기반 통신
3. **변경사항 추적**: 정확한 변경 감지 및 분리
4. **선택적 저장**: 변경된 항목만 처리
5. **완전한 복원**: 원본 상태로 100% 복구 가능

## 📊 데이터 구조

### App.vue (상위 컴포넌트)
```javascript
data() {
  return {
    // 🔹 불변 데이터 소스 (절대 변경되지 않음)
    totalRouteObject: {
      "VHCL001": { vhclId: "VHCL001", detailList: [...], ... },
      "VHCL002": { vhclId: "VHCL002", detailList: [...], ... }
    },
    
    // 🔹 원본 JSON 데이터 보관
    originalJsonData: { /* 완전한 원본 데이터 */ },
    
    // 🔹 현재 선택된 차량들 (편집 가능한 작업용 데이터)
    selectedVehicles: [
      { vhclId: "VHCL001", detailList: [...] }, // 깊은 복사된 독립 객체
      { vhclId: "VHCL002", detailList: [...] }
    ],
    
    // 🔹 저장 상태
    isSavingVehicles: false
  };
}
```

### VehicleDetailList.vue (하위 컴포넌트)
```javascript
data() {
  return {
    // 🔹 변경사항 추적
    hasUnsavedChanges: false,
    
    // 🔹 원본 데이터 백업 (selectedVehicles의 초기 상태)
    originalData: [
      { vhclId: "VHCL001", detailList: [...] }
    ],
    
    // 🔹 변경된 차량 추적 (vhclId를 key로 하는 매핑)
    changedVehiclesData: {
      "VHCL001": [detailList...], // 변경된 detailList
      "VHCL002": [detailList...]
    }
  };
}
```

## 💾 Save 로직 상세 분석

### 1단계: VehicleDetailList.vue의 Save 처리

```javascript
// Save 버튼 클릭 시 호출
async saveChanges() {
  console.log("💾 Save 버튼 클릭 - 변경사항 저장 시작");

  // 1. 변경된 차량만 추출
  const changedVehicles = this.getChangedVehicles();
  
  if (changedVehicles.length === 0) {
    this.showToast("저장할 변경사항이 없습니다.", "warning");
    return;
  }

  // 2. 상위 컴포넌트에 저장 요청 emit
  this.$emit("save-requested", {
    data: this.selectedVehicles,        // 전체 데이터 (참고용)
    changedVehicles: changedVehicles,   // 변경된 차량만
    changedVehiclesData: this.changedVehiclesData, // vhclId: detailList 매핑
    originalData: this.originalData,    // 원본 데이터
    totalCount: this.selectedVehicles.length,
    changedCount: changedVehicles.length
  });
}

// 변경된 차량만 추출하는 헬퍼 메서드
getChangedVehicles() {
  if (!Object.keys(this.changedVehiclesData).length) {
    return [];
  }

  const changedVehicles = [];
  const changedVhclIds = Object.keys(this.changedVehiclesData);

  changedVhclIds.forEach((vhclId) => {
    const vehicle = this.selectedVehicles.find((v) => v.vhclId === vhclId);
    if (vehicle) {
      changedVehicles.push(vehicle);
    }
  });

  return changedVehicles;
}
```

### 2단계: App.vue의 Save 처리

```javascript
// VehicleDetailList에서 emit된 save-requested 이벤트 처리
async handleSaveVehicles(payload) {
  this.isSavingVehicles = true;

  try {
    // 1. 저장할 데이터 추출
    const vehiclesToSave = payload.changedVehicles || payload.data;
    
    // 2. 상세 로깅 (개발/디버깅용)
    console.log("🏢 App.vue에서 차량 데이터 저장 시작");
    vehiclesToSave.forEach((vehicle, index) => {
      console.log(`📋 ${index + 1}. 차량 ID: ${vehicle.vhclId}`);
      console.log(`  - 상세 목록 수: ${vehicle.detailList?.length || 0}개`);
    });

    // 3. 실제 저장 로직 (서버 API 호출)
    // const saveData = {
    //   changedVehicles: vehiclesToSave,
    //   timestamp: new Date().toISOString()
    // };
    // await api.saveVehicleChanges(saveData);
    
    // 시뮬레이션용 딜레이
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 4. 저장 성공 알림
    this.$refs.vehicleDetailList?.notifySaveSuccess();
    
  } catch (error) {
    // 5. 저장 실패 처리
    this.$refs.vehicleDetailList?.notifySaveError(error);
  } finally {
    this.isSavingVehicles = false;
  }
}
```

### 3단계: 저장 성공 후 처리

```javascript
// App.vue에서 호출하는 성공 콜백
notifySaveSuccess() {
  // 1. 현재 상태를 새로운 원본 데이터로 백업
  this.backupOriginalData();
  
  // 2. 사용자에게 성공 알림
  this.showToast("변경사항이 성공적으로 저장되었습니다.", "success");
  
  // 3. 이벤트 발생 (필요시 상위 컴포넌트에서 후처리)
  this.$emit("save-success");
}

// 원본 데이터 백업 메서드
backupOriginalData() {
  if (this.selectedVehicles?.length > 0) {
    // 현재 selectedVehicles를 깊은 복사하여 새로운 원본으로 설정
    this.originalData = JSON.parse(JSON.stringify(this.selectedVehicles));
    this.hasUnsavedChanges = false;      // 변경사항 플래그 리셋
    this.changedVehiclesData = {};       // 변경된 차량 데이터 초기화
    
    console.log("📦 원본 데이터 백업 완료:", this.selectedVehicles.length + "개");
  }
}
```

## 🔄 Reset 로직 상세 분석

### 1단계: VehicleDetailList.vue의 Reset 처리

```javascript
// Reset 버튼 클릭 시 호출
resetChanges() {
  console.log("🔄 Reset 버튼 클릭 - 변경사항 리셋 시작");

  if (!this.originalData) {
    this.showToast("리셋할 원본 데이터가 없습니다.", "warning");
    return;
  }

  // 상위 컴포넌트에 리셋 요청 emit
  this.$emit("reset-requested", {
    originalData: this.originalData,
    changedVehicleIds: Object.keys(this.changedVehiclesData)
  });
}
```

### 2단계: App.vue의 Reset 처리

```javascript
// VehicleDetailList에서 emit된 reset-requested 이벤트 처리
handleResetVehicles(payload) {
  if (!payload.originalData) {
    console.warn("⚠️ 원본 데이터가 없어서 리셋할 수 없습니다.");
    return;
  }

  // 변경된 차량들만 원본 데이터로 복원
  if (payload.changedVehicleIds?.length > 0) {
    payload.changedVehicleIds.forEach((vhclId) => {
      const currentVehicleIndex = this.selectedVehicles.findIndex(
        (v) => v.vhclId === vhclId
      );
      const originalVehicle = payload.originalData.find(
        (v) => v.vhclId === vhclId
      );

      if (currentVehicleIndex !== -1 && originalVehicle) {
        // Vue.set을 사용하여 반응성 보장하며 깊은 복사로 복원
        this.$set(this.selectedVehicles, currentVehicleIndex, {
          ...this.selectedVehicles[currentVehicleIndex],
          detailList: JSON.parse(JSON.stringify(originalVehicle.detailList))
        });
      }
    });
  }

  // 리셋 성공 알림
  this.$refs.vehicleDetailList?.notifyResetSuccess();
}
```

### 3단계: 리셋 성공 후 처리

```javascript
// App.vue에서 호출하는 리셋 성공 콜백
notifyResetSuccess() {
  // 1. 상태 초기화
  this.hasUnsavedChanges = false;
  this.changedVehiclesData = {};

  // 2. 현재 상태를 새로운 원본으로 백업 (리셋된 상태가 새로운 기준점)
  this.originalData = JSON.parse(JSON.stringify(this.selectedVehicles));

  // 3. DOM 업데이트 후 변경사항 재확인
  this.$nextTick(() => {
    this.checkForChanges();
  });

  // 4. 사용자 알림
  this.showToast("변경사항이 리셋되었습니다.", "info");
  this.$emit("reset-success");
}
```

## 🔧 데이터 복원 로직 (차량 선택 변경 시)

### 1단계: 변경 감지 및 복원 요청

```javascript
// selectedVehicles watch에서 호출
watch: {
  selectedVehicles: {
    handler(newValue, oldValue) {
      // 차량 선택이 변경된 경우
      if (this.isVehicleSelectionChanged(newValue, oldValue)) {
        
        // 변경사항이 있는 경우 사용자에게 경고하고 데이터 복원 요청
        if (this.hasUnsavedChanges && oldValue?.length > 0) {
          this.showToast(
            "차량 선택이 변경되어 저장되지 않은 변경사항이 초기화됩니다.",
            "warning"
          );
          
          // 상위 컴포넌트에 데이터 복원 요청
          this.requestDataRestore();
        }

        // 상태 초기화
        this.resetToInitialState();

        // 새로운 차량 선택 시 백업
        if (newValue?.length > 0) {
          this.$nextTick(() => {
            this.backupOriginalData();
          });
        }
      } else {
        // 같은 차량의 detailList만 변경된 경우
        this.checkForChanges();
      }
    },
    deep: true,
    immediate: true
  }
}

// 데이터 복원 요청
requestDataRestore() {
  if (!Object.keys(this.changedVehiclesData).length) {
    return;
  }

  this.$emit("data-restore-requested", {
    changedVehicleIds: Object.keys(this.changedVehiclesData)
  });
}
```

### 2단계: 데이터 복원 처리

```javascript
// data-restore-requested 이벤트 처리
handleDataRestore(payload) {
  if (!payload.changedVehicleIds?.length || !this.totalRouteObject) {
    return;
  }

  // totalRouteObject에서 변경된 차량들을 완전히 복원
  payload.changedVehicleIds.forEach((vhclId) => {
    const currentVehicleIndex = this.selectedVehicles.findIndex(
      (v) => v.vhclId === vhclId
    );
    const originalVehicle = this.totalRouteObject[vhclId];

    if (currentVehicleIndex !== -1 && originalVehicle) {
      // 차량 전체를 원본 데이터로 완전히 교체 (깊은 복사)
      this.$set(
        this.selectedVehicles,
        currentVehicleIndex,
        JSON.parse(JSON.stringify(originalVehicle))
      );
    }
  });
}
```

## 🔍 변경사항 감지 로직

### 변경사항 체크 메서드

```javascript
// 변경사항 감지 메인 메서드
checkForChanges() {
  if (!this.originalData) {
    return;
  }

  // 현재 데이터와 원본 데이터 비교
  const changedVehicles = this.compareDetailLists(
    this.selectedVehicles,
    this.originalData
  );

  // 변경사항 플래그 업데이트
  const hasChanges = Object.keys(changedVehicles).length > 0;
  this.hasUnsavedChanges = hasChanges;
  this.changedVehiclesData = changedVehicles;
}

// detailList 비교 메서드
compareDetailLists(current, original) {
  const changed = {};

  // vhclId를 key로 하는 맵 생성
  const currentMap = {};
  const originalMap = {};

  current.forEach((vehicle) => {
    if (vehicle.vhclId) {
      currentMap[vehicle.vhclId] = vehicle.detailList || [];
    }
  });

  original.forEach((vehicle) => {
    if (vehicle.vhclId) {
      originalMap[vehicle.vhclId] = vehicle.detailList || [];
    }
  });

  // 각 차량의 detailList 비교
  Object.keys(currentMap).forEach((vhclId) => {
    if (!originalMap[vhclId]) return;

    const isChanged = this.isDetailListChanged(
      currentMap[vhclId],
      originalMap[vhclId]
    );

    if (isChanged) {
      changed[vhclId] = currentMap[vhclId];
    }
  });

  return changed;
}

// detailList 상세 비교
isDetailListChanged(currentDetailList, originalDetailList) {
  if (currentDetailList.length !== originalDetailList.length) {
    return true;
  }

  // 각 항목의 순서와 핵심 데이터 비교
  for (let i = 0; i < currentDetailList.length; i++) {
    const current = currentDetailList[i];
    const original = originalDetailList[i];

    if (
      current.stopSeqNo !== original.stopSeqNo ||
      current.orderId !== original.orderId ||
      current.locId !== original.locId
    ) {
      return true;
    }
  }

  return false;
}
```

## 🎯 다른 컴포넌트 확장을 위한 패턴

### 상위 컴포넌트 (App.vue 역할) 템플릿

```javascript
// 필수 데이터 구조
data() {
  return {
    originalSourceData: {},      // 불변 원본 데이터
    selectedItems: [],          // 현재 선택/편집 중인 데이터
    isSaving: false            // 저장 상태
  };
}

// 필수 메서드
methods: {
  buildOriginalDataSource() {
    // 불변 데이터 소스 구축
    // 예: this.originalSourceData = { itemId: itemData, ... }
  },
  
  handleItemsSelected(selectedItems) {
    // 아이템 선택 처리
    // originalSourceData에서 깊은 복사하여 selectedItems 생성
  },
  
  async handleSaveItems(payload) {
    // 저장 처리
    // 1. 변경된 아이템만 추출
    // 2. 서버 API 호출
    // 3. 성공/실패 콜백 호출
  },
  
  handleResetItems(payload) {
    // 리셋 처리
    // 변경된 아이템들을 원본 데이터로 복원
  },
  
  handleDataRestore(payload) {
    // 데이터 복원 처리
    // originalSourceData에서 완전히 복원
  }
}
```

### 하위 컴포넌트 (VehicleDetailList.vue 역할) 템플릿

```javascript
// 필수 데이터 구조
data() {
  return {
    originalData: null,         // 원본 데이터 백업
    hasUnsavedChanges: false,   // 변경사항 플래그
    changedItemsData: {}        // 변경된 아이템 추적
  };
}

// 필수 메서드
methods: {
  checkForChanges() {
    // 변경사항 감지
    // 현재 데이터와 originalData 비교하여 hasUnsavedChanges 업데이트
  },
  
  saveChanges() {
    // 저장 요청
    // 변경된 아이템만 추출하여 save-requested 이벤트 emit
  },
  
  resetChanges() {
    // 리셋 요청
    // reset-requested 이벤트 emit
  },
  
  backupOriginalData() {
    // 원본 데이터 백업
    // 현재 selectedItems를 깊은 복사하여 originalData로 설정
  },
  
  notifySaveSuccess() {
    // 저장 성공 처리
    // backupOriginalData() 호출 및 상태 초기화
  },
  
  notifyResetSuccess() {
    // 리셋 성공 처리
    // 상태 초기화 및 변경사항 재확인
  }
}

// 필수 이벤트
emits: [
  'save-requested',
  'reset-requested', 
  'data-restore-requested'
]

// 필수 watch
watch: {
  selectedItems: {
    handler(newValue, oldValue) {
      // 아이템 선택 변경 감지
      // 변경사항이 있으면 경고 및 복원 요청
      // 새로운 선택 시 백업
    },
    deep: true,
    immediate: true
  }
}
```

### 이벤트 바인딩 예시

```vue
<template>
  <child-component
    :selected-items="selectedItems"
    :is-saving="isSaving"
    @save-requested="handleSaveItems"
    @reset-requested="handleResetItems"
    @data-restore-requested="handleDataRestore"
  />
</template>
```

## ✅ 체크리스트

### 상위 컴포넌트 구현 체크리스트
- [ ] 불변 원본 데이터 소스 구축
- [ ] 선택된 아이템을 위한 깊은 복사 로직
- [ ] 저장 처리 메서드 구현
- [ ] 리셋 처리 메서드 구현
- [ ] 데이터 복원 처리 메서드 구현
- [ ] 저장 상태 관리

### 하위 컴포넌트 구현 체크리스트
- [ ] 원본 데이터 백업 기능
- [ ] 변경사항 감지 로직
- [ ] 저장/리셋 요청 메서드
- [ ] 성공/실패 콜백 메서드
- [ ] 이벤트 emit 구현
- [ ] watch를 통한 선택 변경 감지
- [ ] 사용자 알림 (Toast) 시스템

### 공통 주의사항
- [ ] 깊은 복사 사용으로 데이터 독립성 보장
- [ ] Vue.set 사용으로 반응성 보장
- [ ] $nextTick 활용으로 DOM 업데이트 순서 보장
- [ ] 적절한 로깅으로 디버깅 편의성 제공
- [ ] 예외 상황 처리 (데이터 없음, 네트워크 오류 등)

## 🎉 결론

이 패턴을 따르면 다음과 같은 이점을 얻을 수 있습니다:

- **데이터 무결성**: 원본 데이터 손실 방지
- **성능 최적화**: 변경된 부분만 처리
- **사용자 경험**: 명확한 상태 피드백
- **개발 효율성**: 재사용 가능한 패턴
- **유지보수성**: 명확한 책임 분리

이 가이드를 참고하여 안정적이고 효율적인 Vue.js 애플리케이션을 구축하세요! 🚀 