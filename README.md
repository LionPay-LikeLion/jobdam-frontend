## 🦁 JobDam 프론트엔드 (jobdam-frontend)

JobDam은 구직자, 컨설턴트, 기업을 연결하는 커뮤니티 기반 SNS 플랫폼입니다.
이 레포지토리는 프론트엔드 애플리케이션을 위한 Vite + React + TypeScript 기반 프로젝트입니다.

Lovable Project Link:
**URL**: https://lovable.dev/projects/ef981298-443c-4c78-a702-e15e504c6cbc

---

### 개발 환경 구성 및 실행 방법

로컬에서 실행하려면:
1. 이 프로젝트를 클론하세요:
```
git clone https://github.com/LionPay-LikeLion/jobdam-frontend.git
cd jobdam-frontend
```

2. Node.js가 설치되어 있어야 합니다. (추천: nvm 사용)
3. 의존성 설치:
```
npm install
```
4. 개발 서버 실행:
```
npm run dev
```
실행 후 브라우저에서 http://localhost:5173에 접속하면 됩니다.

---

### 기술 스택
	•	Vite: 초고속 개발 서버 및 번들러
	•	React + TypeScript: UI 및 로직 구현
	•	Tailwind CSS: 유틸리티 기반 CSS 스타일링
	•	shadcn-ui: Radix UI 기반의 Headless 컴포넌트 라이브러리

---

### EC2 수동 배포 방법 (Jenkins + Docker)

이 프로젝트는 Jenkins CI를 통해 EC2로 배포됩니다.

#### 프론트엔드 빌드 명령어
npm run build
	•	dist/ 폴더가 생성되며, NGINX가 이 폴더를 정적 웹 리소스로 사용합니다.

#### Jenkins 파이프라인 요약
1. GitHub main 브랜치로 push → Jenkins Webhook 트리거
2. Jenkins가 아래 작업 수행:
	•	코드 pull
	•	npm install && npm run build
	•	EC2 서버에 dist/ 폴더 scp 복사
	•	NGINX를 통해 /home/ubuntu/frontend에서 서비스 제공

#### NGINX 예시 설정
```
server {
  listen 80;
  server_name jobdam.online;

  root /home/ubuntu/frontend;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```
---

### 디렉토리 구조
```
jobdam-frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.ts
├── package.json
└── vite.config.ts
```

---  
**팀명:** 돈내고사자 (멋쟁이사자처럼 백엔드 15기 회고 5팀)  
**담당:** 프론트엔드 (Lovable 기반 UI → 수동 커스터마이징 → EC2 배포)  
