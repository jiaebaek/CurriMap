# Assets 이미지 파일 TODO

## 📋 필요한 이미지 파일 목록

프로덕션 배포 전에 다음 이미지 파일들을 `frontend/assets/` 폴더에 추가해야 합니다.

### 1. 앱 아이콘 (icon.png)
- **경로**: `frontend/assets/icon.png`
- **크기**: 1024x1024 픽셀
- **형식**: PNG (투명 배경 가능)
- **용도**: iOS 및 Android 앱 아이콘
- **설정 위치**: `app.json` → `expo.icon`

### 2. 스플래시 화면 (splash.png)
- **경로**: `frontend/assets/splash.png`
- **크기**: 권장 2048x2048 픽셀 (또는 1242x2436)
- **형식**: PNG
- **용도**: 앱 시작 시 표시되는 스플래시 화면
- **설정 위치**: `app.json` → `expo.splash.image`

### 3. Android 적응형 아이콘 (adaptive-icon.png)
- **경로**: `frontend/assets/adaptive-icon.png`
- **크기**: 1024x1024 픽셀
- **형식**: PNG
- **용도**: Android 8.0+ 적응형 아이콘
- **설정 위치**: `app.json` → `expo.android.adaptiveIcon.foregroundImage`

### 4. 웹 파비콘 (favicon.png)
- **경로**: `frontend/assets/favicon.png`
- **크기**: 48x48 또는 32x32 픽셀 (권장: 48x48)
- **형식**: PNG 또는 ICO
- **용도**: 웹 브라우저 탭 아이콘
- **설정 위치**: `app.json` → `expo.web.favicon`

## 🔧 app.json 설정 복원

이미지 파일을 추가한 후, `app.json` 파일에서 다음 설정을 복원해야 합니다:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## 📝 체크리스트

- [ ] icon.png 생성 (1024x1024)
- [ ] splash.png 생성 (2048x2048 권장)
- [ ] adaptive-icon.png 생성 (1024x1024)
- [ ] favicon.png 생성 (48x48)
- [ ] 모든 이미지를 `frontend/assets/` 폴더에 배치
- [ ] `app.json`에서 이미지 참조 복원
- [ ] 앱 빌드 테스트

## 💡 디자인 가이드라인

### CurriMap 브랜드 컬러
- 메인 컬러: 따뜻하고 친근한 톤
- 타겟: 엄마 사용자층
- 스타일: 따뜻하고 친근한 디자인

### 아이콘 디자인 팁
- 단순하고 명확한 디자인
- 작은 크기에서도 인식 가능
- CurriMap의 교육/책 컨셉 반영

## 🔗 참고 자료

- [Expo Icons 가이드](https://docs.expo.dev/guides/app-icons/)
- [Expo Splash Screen 가이드](https://docs.expo.dev/guides/splash-screens/)
- [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)

