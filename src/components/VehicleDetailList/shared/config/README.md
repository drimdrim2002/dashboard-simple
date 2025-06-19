# 테이블 컬럼 설정 가이드

## 📝 개요

`tableColumns.js` 파일은 VehicleDetailList의 모든 테이블 컬럼을 중앙에서 관리하는 설정 파일입니다. 헤더와 데이터 셀의 동기화를 보장하여 유지보수성을 크게 향상시킵니다.

## 🎯 주요 장점

### ✅ Before (문제점)

```javascript
// VehicleTable.vue - 헤더 정의
<th>Vehicle ID</th>
<th>Order ID</th>
<th>Weight(KG)</th>

// VehicleDetailItem.vue - 데이터 정의
<td class="vhcl-id">{{ detail.vhclId }}</td>
<td>{{ detail.orderId || detail.locId }}</td>
<td class="text-end">{{ detail.loadWt }}</td>
```

### ✅ After (해결책)

```javascript
// tableColumns.js - 중앙 관리
export const VEHICLE_DETAIL_COLUMNS = [
  {
    key: "vhclId",
    title: "Vehicle ID",
    className: "vhcl-id",
    type: "data",
  },
  {
    key: "orderId",
    title: "Order ID",
    fallback: "locId",
    type: "data",
  },
  {
    key: "loadWt",
    title: "Weight(KG)",
    className: "text-end",
    type: "data",
  },
];
```

## 🔧 컬럼 설정 구조

```typescript
interface TableColumn {
  key: string; // 데이터 키
  title: string; // 헤더 제목
  width?: string; // 컬럼 너비
  align?: string; // 텍스트 정렬
  className?: string; // CSS 클래스
  formatter?: Function; // 데이터 포맷팅 함수
  sortable?: boolean; // 정렬 가능 여부
  visible?: boolean; // 표시 여부
  type: string; // 컬럼 타입
  fallback?: string; // 대체 필드
  fields?: string[]; // 복합 필드 (composite 타입용)
  icon?: string; // 아이콘 (action 타입용)
}
```

## 📋 컬럼 타입별 사용법

### 1. 액션 컬럼 (드래그 핸들)

```javascript
{
  key: 'drag-handle',
  title: '',
  type: 'action',
  icon: 'bi bi-arrows-move'
}
```

### 2. 트리 구조 컬럼

```javascript
{
  key: 'tree',
  title: 'Tree',
  type: 'tree'
}
```

### 3. 순번 컬럼

```javascript
{
  key: 'sequence',
  title: '#',
  type: 'sequence'
}
```

### 4. 일반 데이터 컬럼

```javascript
{
  key: 'vhclId',
  title: 'Vehicle ID',
  type: 'data',
  formatter: (value) => value.toUpperCase()
}
```

### 5. 복합 데이터 컬럼

```javascript
{
  key: 'customerTime',
  title: 'Customer Time',
  type: 'composite',
  fields: ['custOpenTime', 'custCloseTime'],
  formatter: (openTime, closeTime) =>
    `${formatTime24(openTime)} ~ ${formatTime24(closeTime)}`
}
```

### 6. Fallback 지원 컬럼

```javascript
{
  key: 'orderId',
  title: 'Order ID',
  type: 'data',
  fallback: 'locId'  // orderId가 없으면 locId 사용
}
```

## 🚀 새 컬럼 추가 방법

### 1단계: 컬럼 정의 추가

```javascript
// tableColumns.js
export const VEHICLE_DETAIL_COLUMNS = [
  // ... 기존 컬럼들
  {
    key: "newField",
    title: "새 컬럼",
    width: "100px",
    align: "center",
    type: "data",
    visible: true,
    sortable: true,
    formatter: (value) => `${value} 단위`,
  },
];
```

### 2단계: 끝!

더 이상 다른 파일을 수정할 필요가 없습니다. 헤더와 데이터 셀이 자동으로 동기화됩니다.

## 🔄 컬럼 수정/삭제 방법

### 컬럼 제목 변경

```javascript
{
  key: 'loadWt',
  title: 'Weight(KG)', // 이 부분만 수정
  // ... 나머지 설정
}
```

### 컬럼 숨김/표시

```javascript
{
  key: 'someColumn',
  visible: false, // false로 설정하면 숨김
  // ... 나머지 설정
}
```

### 컬럼 삭제

배열에서 해당 객체를 제거하면 됩니다.

## 🎨 스타일링 가이드

### CSS 클래스 적용

```javascript
{
  key: 'amount',
  title: 'Amount',
  className: 'text-end font-weight-bold text-primary',
  type: 'data'
}
```

### 너비 설정

```javascript
{
  key: 'description',
  title: 'Description',
  width: '200px',
  type: 'data'
}
```

## 🧪 고급 사용법

### 동적 컬럼 표시/숨김

```javascript
// 컴포넌트에서
import { updateColumnVisibility } from "./shared/config/tableColumns";

// 특정 컬럼 숨김
updateColumnVisibility("loadWt", false);

// 특정 컬럼 표시
updateColumnVisibility("loadWt", true);
```

### 컬럼 타입별 필터링

```javascript
import { getColumnsByType } from "./shared/config/tableColumns";

// 데이터 컬럼만 가져오기
const dataColumns = getColumnsByType("data");

// 액션 컬럼만 가져오기
const actionColumns = getColumnsByType("action");
```

## ⚠️ 주의사항

1. **key 값은 유니크해야 합니다**
2. **type은 반드시 지정해야 합니다**
3. **formatter 함수는 순수 함수여야 합니다**
4. **visible: false로 설정한 컬럼은 렌더링되지 않습니다**

## 🔧 마이그레이션 가이드

기존 테이블을 이 구조로 마이그레이션하려면:

1. 기존 헤더 정의를 분석하여 컬럼 배열 생성
2. 기존 데이터 셀 정의를 분석하여 포맷터 함수 추출
3. TableCell 컴포넌트 사용으로 변경
4. 기존 중복 코드 제거

이렇게 하면 **컬럼 하나 추가/수정/삭제 시 한 곳만 수정**하면 되어 유지보수성이 크게 향상됩니다! 🎉
