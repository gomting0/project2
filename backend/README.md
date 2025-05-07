# 강아지 정보 챗봇 백엔드

이 프로젝트는 강아지 정보를 제공하는 챗봇의 백엔드 서버입니다.

## 설치 방법

1. Python 3.8 이상이 설치되어 있어야 합니다.

2. 필요한 패키지 설치:
```bash
pip install -r requirements.txt
```

3. 환경 변수 설정:
- `.env.example` 파일을 `.env`로 복사
- OpenAI API 키를 `.env` 파일에 설정

## 실행 방법

```bash
uvicorn main:app --reload
```

서버가 http://localhost:8000 에서 실행됩니다.

## API 엔드포인트

### POST /api/chat
챗봇과 대화하기 위한 엔드포인트

요청 본문:
```json
{
    "message": "사용자 메시지"
}
```

응답:
```json
{
    "response": "챗봇 응답"
}
``` 