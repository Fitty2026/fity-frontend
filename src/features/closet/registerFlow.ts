/** 옷 등록 진입 갈래 — 영수증 사진을 올리거나, 쇼핑몰 구매내역에서 가져온다 */
export type RegisterEntry = 'receipt' | 'purchase';

/**
 * 권한 안내를 지난 뒤 갈 곳.
 * 영수증  → 촬영·앨범 방식 선택
 * 구매내역 → 쇼핑몰 선택 (거기서 앨범 업로드로 이어진다)
 */
export const pathAfterPermission = (entry: RegisterEntry | undefined) =>
  entry === 'purchase' ? '/closet/register/platform' : '/closet/register/receipt-method';

/**
 * 등록을 시작할 때 갈 곳.
 * 권한 안내는 최초 1회만 — 이미 봤으면 건너뛰고 바로 다음 화면으로 보낸다.
 */
export const registerStartPath = (entry: RegisterEntry, permissionSeen: boolean) =>
  permissionSeen ? pathAfterPermission(entry) : '/closet/register/permission';
