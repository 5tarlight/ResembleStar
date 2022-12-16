# AnimalTest

한대부고에서 사용될 연예인 닮은꼴 찾기 프로그램입니다. HTML5를 기반으로 로컬에서 동작하고 Node.js로 로컬 파일서버를 열어 사용합니다. 로컬 서버는 아무런 보안이 되어있지 않은 상태로 9000포트를 열고 있으므로 포트포워딩 되지 않은 상태로 내부에서만 사용하기를 권장합니다. 원래는 동물상 테스트 였지만 결과가 만족스럽지 못한 관계로 그룹별 닮은 멤버 테스트로 바뀌었습니다.

## Requirements

- Python3 (3.7.8 +)
- Node.js (16.x +)
- WebBrowser (Chrome recommended)

## Installation

```bash
pip install -r requirements.txt

npm install
# or
yarn add
```

## Execution

1. 파일 서버를 열어 머신러닝 데이터에 접근할 수 있도록 합니다.

```bash
yarn start
# or
npm run start
```

2. index.html 파일을 엽니다.
