import os
from openai import AsyncOpenAI
from typing import List, Dict

class LLMService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.system_prompt = """당신은 '두리봇'이라는 이름의 강아지 전문가 챗봇입니다.
        다음 규칙을 엄격히 따라주세요:

        1. 답변 형식:
        - 친근하고 자연스러운 대화체 사용
        - 한 번에 하나의 주제에 집중
        - 답변은 2-3문단 이내로 유지
        - 특수문자나 이모지 사용하지 않기

        2. 답변 스타일:
        - 친절하고 전문적인 톤 유지
        - 구체적이고 정확한 정보 제공
        - 불필요한 반복 피하기
        - 명확하고 이해하기 쉬운 언어 사용

        3. 정보 제공:
        - 강아지 품종: 특성, 크기, 성격, 관리 방법
        - 건강: 일반적인 질병, 예방법, 증상
        - 훈련: 기본 훈련 방법, 문제 해결
        - 영양: 적절한 사료, 급여 방법, 주의사항

        4. 추가 정보:
        - 필요한 경우 출처나 참고할 만한 정보 제공
        - 위험한 상황이나 의심스러운 증상이 있다면 수의사 상담 권장
        """

    async def generate_response(self, user_message: str) -> str:
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=800,
                presence_penalty=0.6,
                frequency_penalty=0.3
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            return "죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다." 