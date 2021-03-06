# SNS 화면 만들기

+ [App.js로 레이아웃 분리하기](#App.js로-레이아웃-분리하기) 
+ [prop-types](#prop-types) 
+ [antd 그리드 시스템](#antd-그리드-시스템)
+ [커스텀 훅 사용하기](#커스텀-훅-사용하기)
+ [메인 화면 만들기](#메인-화면-만들기)
+ [프로필 화면 만들기](#프로필-화면-만들기)
+ [컴포넌트 분리 하기](#컴포넌트-분리-하기)


## App.js로 레이아웃 분리하기
[위로가기](#SNS-화면-만들기)

useCallback을 사용해서 이벤트리스너를 감싸주자! <br>
왜냐하면, props를 넘겨주는 함수, 메서드는 useCallback을 해줘야한다. <br>
자세한 설명은 무료강의에 있다. <br>

#### pages/signup.js
```js
...생략
  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false); // 약관 동의 (체크박스)
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 에러
  const [termError, setTermError] = useState(false); // 약간 동의 안 할 경우

  // 커스텀 훅이다. 기존의 후을 사용해서 새로운 훅을 만들어낸다.
  const useInput = (initValue = null) => {
    const [value, setter] = useState(initValue);
    const handler = useCallback((e) => {
      setter(e.target.value);
    }, []);
    return [value, handler];
  };
  const [id, onChangeId] = useInput(''); // 사용예시
  const [nick, onChangeNick] = useInput('');
  const [password, onChangePassword] = useInput('');
  
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    if ( password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      setTermError(true);
    }
  }, [password, passwordCheck, term]);
  
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordError(e.target.value !== password); 
    setPasswordCheck(e.target.value);
  }, [password]); // 함수 내부에서 쓰는 state를 deps 배열로 넣어야한다.
  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []); // 함수 내부에서 쓰는 state를 deps 배열로 넣어야한다.
...생략
```

함수 내부에서 쓰는 state를 deps 배열로 넣어야한다. <br>

react devtools보면 렌더링이 심하게 되어있다. (반짝거리는 거) <br>
여기서 Head, AppLayout이 겹쳐있어서 분리를 할 것이다. <br>

모든 페이지에 공통적으로 들어간 것이 Layout이다. <br>
Layout을 위한 파일을 만들 것이다. <br>
하지만 Next에 따로 지정해놓았다. <br>
그러므로 _app.js파일을 만들 것이다. 그러면 자동으로 _app.js가 레이아웃이 된다. <br>
이제부터 공통된 부분을 app.js에 넣어 줄 것이다. (파일이름 잘 볼 것!!) <br>

#### pages/_app.js
```js
import React from 'react';
import AppLayout from '../components/App.Layout';
import Head from 'next/head';

const NodeBird = ({Component}) => {
  return (
    <>
      <Head>
        <title>NodeBird</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
      </Head>
      <AppLayout>
        <Component /> // 이렇게 해줘야 한다.
      </AppLayout>
    </>
  );
};

export default NodeBird;
```

.app.js가 props로 Component를 받는다. <br>
Component는 index, profile, signup들을 넣어준다.  <br>

하지만 바로 실행하면 적용이 바로되지가 않는다!!! <br>
잘 되기위해서는 서버를 다시 실행해야한다!! <br>

#### pages/index.js
```js
import React from 'react';

const Home = () => {
  return (
    <>
      <div>Hello, Next!</div>
    </>
  );
};

export default Home;
```
위 처럼 공통된 부분 삭제한다. signup.js, profile.js는 생략한다.

### Form태그 안에서의 리 렌더링하기

중복되는 것( 같은 컴포넌트)가 들어있으면, 리 렌더링 다 같이된다. 그렇기 위해서는 위처럼 분리한다.<br>
따른 컴포넌트를 분리해서 Form만 리 렌더링이 된다.<br>

아이디만 바꾸는데, 비밀번호, 비밀번호체크, 닉네임도 리 렌더링이 된다. 왜??<br>
아이디에 글자를 치면, Form 전체가 리 렌더링이 된다. 즉, 같은 컴포넌트에 있어서 리 렌더링이 된다.<br>
리 렌더링을 하지 않으려면, React.memo를 해줘야한다. 근데 하필, 컨트롤 할 수 있는 있는게 아니다.<br>
왜냐하면, 여기서 input은 antd의 Input이라서 안된다. 근데 하는 방법이 있다.<br>

#### pages/signup.js
```js
import React, { useState, useCallback, memo } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';

const TextInput = memo(({ value, onChange}) => { // 1) 컴포넌트를 만든다.  3) props도 만든다.
  return (
    <Input value={value} required onChange={onChange} /> // 2) Input을 가져온다.
  );
});

const Signup = () => {
  ...생략
  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding : 10}} >
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <TextInput value={id} onChange={onChangeId} /> // 4) TextInput추가
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <TextInput value={nick} onChange={onChangeNick} />  // 4) TextInput추가
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <TextInput name="user-password" type="password" value={password} required onChange={onChangePassword} /> // 4) TextInput추가
        </div>
        ...생략 
      </Form>
    </>
  );
};

export default Signup;
```

하지만, 지나친 최적하는 안해줘도 된다!<br>
페이스북도 이 정도록 지나치게 하지않는다. 참고로만 알아줘도 된다.<br>
나쁜건은 아니지만, 시간이 지나치다.<br>


## prop types 
[위로가기](#SNS-화면-만들기)

prop-types는 컴포넌트 아래에다가 prop들의 자료형을 적어준다. <br>
렌더링이 될 때 부모로부터 올 바른 데이터형을 받았는지 확인된다. <br>
prop-types를 하면 프로그래밍이 좀 더 안정적으로 된다. <br>

<pre><code>npm i prop-types</code></pre>

#### pages/_app.js
```js
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types'; // 추가

const NodeBird = ({Component}) => {
  return (
    <>
      <Head>
        <title>NodeBird</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
      </Head>
      <AppLayout>
        <Component />
      </AppLayout>
    </>
  );
};

// 이렇게 추가를 해준다.
NodeBird.prototype = {
  Component : PropTypes.elementType // node는 js에 들어갈 수 있는 모든 것 (컴포넌트, 숫자, boolean, 함수 등등)
  // elementType로 수정
}

export default NodeBird;
```

자세한 내용은 링크를 걸어놓겠다. <br>
https://github.com/facebook/prop-types <br>
이렇게 하면 타입스크립트랑 비슷해진다. 하지만, 타입스크립트는 prop-types를 사용하지 않는다. <br>

#### component/App.Layout.js
```js
import React from 'react';
import { Menu, Input, Button } from 'antd';
import Link from 'next/link'
import PropTypes from 'prop-types'; // 추가

const AppLayout = ({ children }) => {
  ...생략
};

AppLayout.prototype = {
  children: PropTypes.node,
}

export default AppLayout;
```

## antd 그리드 시스템
[위로가기](#SNS-화면-만들기)

_app.js의 내용을 추가하면 모든 페이지에 공통적으로 내용이 추가된다. <br>

이제 그리드 시스템을 사용할 것이다.<br>
https://ant.design/components/grid/ (링크 참고)<br>

Row Col가 있다.<br>
퍼블리싱할 때 쓰이는 방법이 있는데, 페이지가 있으면 가로를 먼저 나눈 다음에 세로로 나눈다. <br>

#### Component/App.Layout.js
```js
<Row>
  <Col xs={24} md={6} >첫번째</Col> 
  <Col xs={24} md={12} >두번째</Col>
  <Col xs={24} md={6} >세번쨰</Col>
</Row>
```
소스분석 : 모바일은 전체화면으로, 중간화면은 6/12/6 사이즈 비율로 된다. <br>

전체화면이 24, 반은 12/12, 3등분은 8/8/8, 4등분은 6/6/6/6 (비율로 조절된다) <br>

xs : 모바일(제일 작은 화면)<br>
sm : 작은 화면<br>
md : 중간 화면<br>
lg : 큰 화면<br>

#### Component/App.Layout.js
```js
import { Menu, Input, Button, Row, Col, Card, Avatar} from 'antd';
// 가짜데이터 만들어주는 dummy를 만들어준다.
const dummy = {
  nickname: 'LEEKY'
}

const AppLayout = ({ children }) => {
  return (
    ...생략
    <Row>
      <Col xs={24} md={6} > 
        <Card>
          <Card.Meta 
            avatar={<Avatar>{dummy.nickname[0]}</Avatar>} // 아바타라는 antd를 사용
            title={dummy.nickname} // 카드에 제목을 붙여준다.
          />
        </Card>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </Col> 
      <Col xs={24} md={12} >
        {children}
      </Col>
      <Col xs={24} md={6} >세번쨰</Col>
    </Row>
    ...생략
  );
};
```
### dummy라는 데이터를 만드는 이유
실무에서 협업을 하는데 백엔드, 프론트 나눠져있는데<br>
백엔드는 DB, API코드 등 만들고, 프론트는 화면, 서버로 받은 화면만드는데<br>
가끔 프론트쪽이 빠른 경우가 있는데 그럴 떄에는 서버로 받은 데이터가 아직없는데<br>
가짜같은 객체를 만들어줘서 예상을 한다.<br>
팁인데, dummy라는 객체를 많이 만들어줘서 예상하는 것도 좋다.<br>

#### Component/App.Layout.js
```js
const dummy = {
  nickname: 'LEEKY',
  Post: [],
  Followings: [],
  Followers: [],
}

const AppLayout = ({ children }) => {
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
         <Menu.Item key="mail">
            <Input.Search enterButton style={{ verticalAlign : 'middle' }} />
        </Menu.Item>
      </Menu>
      <Row>
        <Col xs={24} md={6} >
          <Card
            actions={[
              <div key="twit">짹짹<br />{dummy.Post.legnth}</div>, // 추가
              <div key="following">팔로잉<br />{dummy.Followings.legnth}</div>, // 추가
              <div key="follower">팔로워<br />{dummy.Followers.legnth}</div>, // 추가
            ]}>
            <Card.Meta 
              avatar={<Avatar>{dummy.nickname[0]}</Avatar>} 
              title={dummy.nickname}
            />
          </Card>
          <Link href="/signup"><a><Button>회원가입</Button></a></Link>
         
        </Col> 
        <Col xs={24} md={12} >
          {children}
        </Col>
        <Col xs={24} md={6} >세번쨰</Col>
      </Row>
    </div>
  );
};
```

실제 데이터가 없더라도 예상하면 만드는 것도 좋다.<br>
서버에서 이 형식으로 값을 전달하기 떄문에 이처럼 만들었다.<br> 


## 커스텀 훅 사용하기
[위로가기](#SNS-화면-만들기)

로그인 폼을 만들어보겠다. <br>

#### App.Layout.js
```js
...생략
<Card.Meta 
    avatar={<Avatar>{dummy.nickname[0]}</Avatar>} // 앞 급잘
    title={dummy.nickname}
  />
</Card>

<Form>
  <div>
    <label htmlFor="user-id">아이디</label>
    <br />
    <Input name="user-id" value={userId} onChange={onChangeId} required />
  </div>
  <div>
    <label htmlFor="user-password">비밀번호</label>
    <br />
    <Input name="user-password" type="password" value={password} onChange={onChangePassword} required />
  </div>
  <div>
    <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
    <Link href="/signup"><a><Button>회원가입</Button></a></Link>
  </div>
</Form>
...생략
```
확인을 위해서 value, onChange 잠시 삭제를 하였다. <br>

여기서 로그인하면 카드를 보여주고 로그인을 안하면 회원 폼을 보여주도록 하겠다. <br>
일단 더미 데이터로 임시로 사용하겠다. <br>

#### App.Layout.js
```js
const dummy = {
  nickname: 'LEEKY',
  Post: [],
  Followings: [],
  Followers: [],
  isLoggedIn : true,
}

...생략
<Row>
  <Col xs={24} md={6} >
    {dummy.isLoggedIn // 삼항 연연자를 사용하였다
    ? <Card
      actions={[
        <div key="twit">짹짹<br />{dummy.Post.legnth}</div>,
        <div key="following">팔로잉<br />{dummy.Followings.legnth}</div>,
        <div key="follower">팔로워<br />{dummy.Followers.legnth}</div>,
      ]}>
      <Card.Meta 
        avatar={<Avatar>{dummy.nickname[0]}</Avatar>} // 앞 급잘
        title={dummy.nickname}
      />
    </Card> 
    : 
    <Form>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" type="password" required />
      </div>
      <div>
        <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </div>
    </Form>
  }   
  </Col> 
  ...생략
</Row>
```
isLoggedIn가 true면 프로필을 보여주고, false면 프로필 사진이 아니라 회원로그인 폼을 보여준다. <br>
일단 서버 쪽에서 데이터를 안 주기 때문에 dummy로 하겠다. <br>

컴포넌트 분리를 하겠다. <br>

#### LoginForm.js
```js
import React from 'react'
import { Form, Input, Button} from 'antd';

const LoginForm = () => {
  return (
    <Form>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" type="password" required />
      </div>
      <div>
        <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </div>
    </Form>
  )
}

export default LoginForm;
```

컴포넌트 분리하는 것에 좋은 조건은 조건문, 삼항연산자, 반복문 쓰기에 적합하다. <br>

#### App.Layout.js

```js
<Col xs={24} md={6} >
  {dummy.isLoggedIn 
  ? <Card
    actions={[
      <div key="twit">짹짹<br />{dummy.Post.legnth}</div>,
      <div key="following">팔로잉<br />{dummy.Followings.legnth}</div>,
      <div key="follower">팔로워<br />{dummy.Followers.legnth}</div>,
    ]}>
    <Card.Meta 
      avatar={<Avatar>{dummy.nickname[0]}</Avatar>} // 앞 급잘
      title={dummy.nickname}
    />
  </Card> 
  : 
  <LoginForm />
}   
</Col> 
```


커스텀 훅으로 재사용을 하겠다. <br>
```js
...생략
import {useInput} from '../pages/signup' // 모듈로 받아온다.

const LoginForm = () => {
  
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useState('');

  const onsubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log({id, password});
  }, [id, password]); // 자식 컴포넌트 넘겨주는 것은 무조건 useCallback을 해준다.

  return (
    <Form onSubmit={onsubmitForm}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" value={id} onchange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" value={password} onChange={onChangePassword} type="password" required />
      </div>
      <div>
        <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </div>
    </Form>
  )
}

export default LoginForm;
```
커스텀 훅을 사용해서 중복을 없앨 수 있다. 그리고 더미데이터로 미리 확인해주는 것도 좋다. <br>


## 메인 화면 만들기
[위로가기](#SNS-화면-만들기)


#### pages/index.js
```js
import React from 'react';
import { Form, Input, Button } from 'antd';

const dummy = {
  isLoggedIn : true,
  imagePaths: [],
}

const Home = () => {
  return (
    <div>
      {dummy.isLoggedIn  
      // 이미지 전송 Form에서는 multipart/fomr-data를 해줘야한다. 
      && <Form style={{ marginBottom: 20 }} encType="multipart/fomr-data">
          <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?" />  
          <div>
            <input type="file" multiple hidden />
            <Button>이미지 업로드</Button>
            <Button type="primary" style={{ float : 'right'}} htmlType="submit">업로드</Button>
          </div>
          <div>
            {dummy.imagePaths.map((v, i) => {
              return (
                <div key={v} style={{ display: 'inline-black' }}>
                  <img src={'http://localhost:3065/' + v} style={{ width : '200px' }} alt={v} />
                  <div>
                    <Button>제거</Button>
                  </div>
                </div>
              )
            })}  
          </div>  
      </Form>}
    </div>
  );
};

export default Home;
```

#### pages/index.js
```js
...생략
const dummy = {
  isLoggedIn : true,
  imagePaths: [],
  mainPosts: [],
}

const Home = () => {
  return (
    <div>
      ...생략
      {dummy.mainPosts.map((c) => {
        // 게시글 나오는 화면
        return (
          <Card
            key={+c.createAt}
            // cover에 이미지를 넣어주었다.
            cover={c.img && <img alt="example" src={c.img} />}
            actions={[
              <Icon type="retweet" key="retweet" />,
              <Icon type="heart" key="heart" />,
              <Icon type="message" key="message" />,
              <Icon type="ellipsis" key="ellipsis" />,
            ]}
            extra={<Button>팔로우</Button>}
          >
           // 카드 세부 정보
            <Card.Meta 
              avatar={<Avatar>{c.User.nickname[0]}</Avatar>} // 아바타 화면
              title={c.User.nickname} // 아바타 제목
              description={c.content} // 아바타 내용
            />
          </Card>
        )
      })}
    </div>
  );
};

export default Home;
```

#### pages/index.js
```js
const dummy = {
  isLoggedIn : true,
  imagePaths: [],
  mainPosts: [{
    User: {
      id : 1,
      nickname : 'LEEKY',
    },
    content: '첫번 째 게시글',
    // img는 img예시로 넣어주었다. 저작권이 없는 거라서 괜찮음.
    img: 'https://img.freepik.com/free-photo/hooded-computer-hacker-stealing-information-with-laptop_155003-1918.jpg?size=664&ext=jpg',
  }],
}
```
예로 들어서, 더미에 데이터를 이런식으로 넣어주면 게시글이 보인다.

#### component/App.Layout.js
```js
...생략

const AppLayout = ({ children }) => {
  return (
    <div>
      ...생략
      <Row gutter={10} > // gutter라는 것이 있는데 간격을 띄워준다. 공백생기는 것!!
        ...생략
      </Row>
    </div>
  );
};

AppLayout.prototype = {
  children: PropTypes.node,
}

export default AppLayout;
```

### gutter : Col간의 간격
<br>


## 프로필 화면 만들기]
[위로가기](#SNS-화면-만들기)

#### \pages\profile.js
```js
import React from 'react';
import {Form, Input, Button, List, Card, Icon} from 'antd';

const Profile = () => {
  return (
    <div>
      <Form style={{ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px' }}>
        <Input addonBefore="닉네임" />
        <Button type="primary">수정</Button>
      </Form>

      {/* 팔로워 목록 */}
      <List
        style={{ marginBottom: '20px'}}
        grid={{ gutter:4, xs:2, md: 3}} // 아이템들에 간격을 해준다 (디자인)
        size="small" // 사이즈는 작게 (디자인)
        header={<div>팔로워 목록</div>} 
        loadMore={<Button style={{width: '100%'}}>더 보기</Button>} // 더보기 버튼
        bordered // 테두리 디자인 옵션
        dataSource={['영이', '건이', '얏호']} // 실제 안에 들어 갈 데이터들
        renderItem={ item => (
          <List.Item style={{ marginTop: '20px'}}>
            {/* 배열 안에 jsx를 사용할 떄에는 key를 꼭!! 넣어여한다. 밑에 키 안에 stop이 있다. */}
            <Card actions={[<Icon type="stop" key="stop" />]}><Card.Meta description={item} /></Card>
          </List.Item>
        )}
      />

      {/* 팔로잉 목록 */}
      <List
        style={{ marginBottom: '20px'}}
        grid={{ gutter:4, xs:2, md: 3}} // 아이템들에 간격을 해준다 (디자인)
        size="small" // 사이즈는 작게 (디자인)
        header={<div>팔로잉 목록</div>} 
        loadMore={<Button style={{width: '100%'}}>더 보기</Button>} // 더보기 버튼
        bordered // 테두리 디자인 옵션
        dataSource={['영이', '건이', '얏호']} // 실제 안에 들어 갈 데이터들
        renderItem={ item => (
          <List.Item style={{ marginTop: '20px'}}>
            {/* Card.Meta가 dataSource에 데이터를 사용하는 것 */}
            <Card actions={[<Icon type="stop" key="stop" />]}><Card.Meta description={item} /></Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Profile;
```

아이콘 설명 (밑에 링크 참고) <br>
https://ant.design/components/icon/ <br>



## 컴포넌트 분리 하기
[위로가기](#SNS-화면-만들기)

여기서 컴포넌트 분리를 하겠다.<br>
중요한게 있는데 분리를 하면 컴포넌트도 분리하기 때문에 컴포넌트 처리도 잘 해줘야한다.<br>


#### \front\pages\index.js
```js
import React from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const dummy = {
  isLoggedIn : true,
  imagePaths: [],
  mainPosts: [{
    User: {
      id : 1,
      nickname : 'LEEKY',
    },
    content: '첫번 째 게시글',
    // img는 img예시로 넣어주었다. 저작권이 없는 거라서 괜찮음.
    img: 'https://img.freepik.com/free-photo/hooded-computer-hacker-stealing-information-with-laptop_155003-1918.jpg?size=664&ext=jpg',
  }],
}

const Home = () => {
  return (
    <div>
      {dummy.isLoggedIn && <PostForm /> }
      {dummy.mainPosts.map((c) => {
        // 게시글 나오는 화면
        return (
          <PostCard key={c} post={c} /> 
        )
      })}
    </div>
  );
};

export default Home;
```
여기에 자세히 보면 부모의 props가 자식의 props에 값(c) 을 넘겨준다. <br>
자식의 props는 post라고 정의했다. <br>
자식의 props가 부모의 props을 넘겨받을 때에는 post로 넘겨받아야한다. <br>
아.. 그냥 눈으로 보고 이런식으로 하자.. 설명 못하긌다..<br>

PostCard에 보면 부모 props받을 떄에는 post를 작성해줘야한다. <br>

#### \front\components\PostCard.js
```js
import React from 'react';
import { Card, Icon, Button, Avatar } from 'antd';
import PropTypes from 'prop-types';

const PostCard = ({post}) => { // index.js에서의 부모 props를 받아온다.
// 이전에 +c.createAt으로 되어있었는데 +post.createAt으로 해주었다 
// post로 교체해주면 된다.
  return (
    <Card
      key={+post.createAt}
      cover={post.img && <img alt="example" src={post.img} />}
      actions={[
        <Icon type="retweet" key="retweet" />,
        <Icon type="heart" key="heart" />,
        <Icon type="message" key="message" />,
        <Icon type="ellipsis" key="ellipsis" />,
      ]}
      extra={<Button>팔로우</Button>}
    >
      {/* 카드 세부 정보  */}
      <Card.Meta 
        avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
        title={post.User.nickname}
        description={post.content}
      />
    </Card>
  )
}

// props들을 정의해준다.
PostCard.prototypes = { 
  post: PropTypes.shape({ // shape가 객체이다.
    User : PropTypes.object,
    content : PropTypes.string,
    img: PropTypes.string,
    createAt: PropTypes.object,  
  }),
}

export default PostCard;
```

router.js:442 Uncaught (in promise) Error: Invalid href passed to router: <br>
Link 안에 `prefetch={false}`를 추가해주었다. <br>