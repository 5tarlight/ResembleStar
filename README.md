# ResembleStar

한대부고 2022 연말 이벤트에 사용된 닮은꼴 연예인 찾기 레포입니다. 인공지능을 이용하여 그룹에서 나와 가장 유사도가 높은 연예인을 찾아줍니다. 특정 용도로만 제작되었기 때문에 FHD환경에서 정상작동하고 적절한 보안이 갖춰져있지 않습니다. 배경의 눈이 내리는 효과 때문에 저사양 환경에서는 이미지 인식 모델과 같이 사용시 성능이 굉장히 저하될 수 있습니다.

![image](https://user-images.githubusercontent.com/45203447/218202874-d710a115-5792-4e4a-8c07-0570425dee1d.png)


## Requirements

- Python3 (3.7.8 +)
- Node.js (16.x +)
- WebBrowser (Chrome recommended)

## Installation

```bash
pip install -r requirements.txt

npm install
# or
yarn
```

또는, 한번의 자동화된 툴을 이용합니다. (Linux/MacOS 전용)

```bash
./setup.sh
```

## Execution

1. 파일 서버를 열어 머신러닝 데이터에 접근할 수 있도록 합니다.

```bash
yarn start
# or
npm run start
```

2. index.html 파일을 엽니다.
