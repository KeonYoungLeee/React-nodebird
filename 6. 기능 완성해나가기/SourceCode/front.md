# 기능 완성해나가기

+ [해시태그 링크로 만들기](#해시태그-링크로-만들기)
+ [next와 express 연결하기](#next와-express-연결하기)
+ [getInitialProps로 서버 데이터 받기](#getInitialProps로-서버-데이터-받기)
+ [해시태그 검색, 유저 정보 라우터 만들기](#해시태그-검색,-유저-정보-라우터-만들기)
+ [Link 컴포넌트 고급 사용법](#Link-컴포넌트-고급-사용법)
+ [댓글 작성, 댓글 로딩](#댓글-작성,-댓글-로딩)
+ [미들웨어로 중복 제거하기](#미들웨어로-중복-제거하기)
+ [이미지 업로드 프론트 구현하기](#이미지-업로드-프론트-구현하기)
+ [multer로 이미지 업로드 받기](#multer로-이미지-업로드-받기)
+ [express static과 이미지 제거](#express-static과-이미지-제거)
+ [폼데이터로 게시글 올리기](#폼데이터로-게시글-올리기)
+ [게시글 이미지 표시하기](#게시글-이미지-표시하기)  
+ [react slick으로 이미지 슬라이더 구현](#react-slick으로-이미지-슬라이더-구현)
+ [게시글 좋아요, 좋아요 취소](#게시글-좋아요,-좋아요-취소)
+ [리트윗 API 만들기](#리트윗-API-만들기)
+ [리트윗 프론트 화면 만들기](#리트윗-프론트-화면-만들기)
+ [팔로우 언팔로우](#팔로우-언팔로우)
+ [다른 리듀서 데이터 조작하기](#다른-리듀서-데이터-조작하기)
+ [프로필 및 데이터 로딩하기](#프로필-및-데이터-로딩하기)
+ [닉네임 수정하기](#닉네임-수정하기)



## 해시태그 링크로 만들기
[위로가기](#기능-완성해나가기)

#### \front\components\PostCard.js
```js
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from 'antd';
import Link from 'next/link'
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const PostCard = ({post}) => {

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
  }, []);
  
  const onSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!me) {
      return alert('로그인이 필요합니다.');
    };
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
      }
    })
    
  }, [me && me.id]);

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
  }, [commentAdded]);

  // useEffect(() => {
  //   setCommentText('');
  // }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.img && <img alt="example" src={post.img} />}
        actions={[
          <Icon type="retweet" key="retweet" />,
          <Icon type="heart" key="heart" />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
        extra={<Button>팔로우</Button>}
      >
        <Card.Meta 
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={(
            <div>
              {post.content.split(/(#[^\s]+)/g).map((v, i) => {
                if (v.match(/#[^\s]+/)) {
                  return (
                    <Link href="/hashtag" key={i} ><a>{v}</a></Link>
                  );
                }
                return v;
              })};
            </div>
          )}
        />
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>클릭</Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={ item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )} 
    </div>
  )
};

PostCard.prototypes = {
  post: PropTypes.shape({
    User : PropTypes.object,
    content : PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.object,  
  }),
}

export default PostCard;
```

#### \front\pages\hashtag.js
```js
import React from 'react';

const Hashtag = () => {
  return (
    <div>Hashtag</div>
  );
}

export default Hashtag;

```

## next와 express 연결하기
[위로가기](#기능-완성해나가기)

#### \front\nodemon.json
```js
{
  "watch": [
    "server.js",
    "nodemon.json"
  ],
  "exec": "node server.js",
  "ext": "js json jsx"
}
```

#### \front\package.json
```json
{
  "name": "react-nodebird-front",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon",
    "build": "next build",
    "start": "next start"
  },
  "author": "LEEKY",
  "license": "MIT",
  "dependencies": {
    "antd": "^3.26.13",
    "axios": "^0.19.2",
    "cookie-parser": "^1.4.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "express-session": "^1.17.0",
    "morgan": "^1.10.0",
    "next": "^9.3.4",
    "next-redux-wrapper": "^5.0.0",
    "prop-types": "^15.7.2",
    "react": "^16.13.0",
    "react-dom": "^16.13.0",
    "react-redux": "^7.2.0",
    "react-saga": "^0.3.1",
    "redux": "^4.0.5",
    "redux-saga": "^1.1.3"
  },
  "devDependencies": {
    "babel-eslint": "^10.1.0",
    "eslint": "^5.16.0",
    "eslint-config-airbnb": "^17.1.1",
    "eslint-plugin-import": "^2.20.1",
    "eslint-plugin-jsx-a11y": "^6.2.3",
    "eslint-plugin-react": "^7.19.0",
    "eslint-plugin-react-hooks": "^2.5.0",
    "nodemon": "^2.0.2",
    "webpack": "^4.42.0"
  }
}

```

#### \front\server.js
```js
const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');

const dev = process.env.NOCE_ENV !== 'development'; 
const prod = process.env.NOCE_ENV === 'production'; 

const app = next({ dev }); 
const handle = app.getRequestHandler(); 
dotenv.config();

app.prepare().then( () => { 
  
  const server = express(); 
  server.use(morgan('dev'));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser(process.env.COOKIE_SECRET)); 
  server.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })); 

  server.get('*', (req, res) => { 
    return handle(req, res);
  });

  server.listen(3060, () => {
    console.log("next-express running on port 3060");
  })
}); 
```

#### \front\reducers\post.js
```js
export const initialState = {
  mainPosts: [],
  imagePaths: [],
  addPostErrorReason: '',
  isAddingPost: false,
  postAdded: false,
  isAddingComment: false,
  addCommentErrorReason: '',
  commentAdded: false,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const LOAD_MAIN_REQUEST = 'LOAD_MAIN_REQUEST';
export const LOAD_MAIN_SUCCESS = 'LOAD_MAIN_SUCCESS';
export const LOAD_MAIN_FAILURE = 'LOAD_MAIN_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const LOAD_COMMENTS_FAILURE = 'LOAD_COMMENTS_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const UPDATE_POST_REQUEST = 'UPDATE_POST_REQUEST';
export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
export const UPDATE_POST_FAILURE = 'UPDATE_POST_FAILURE';

export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';


export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST: {
      return {
        ...state,
        isAddingPost: true,
        addPostErrorReason: '',
        postAdded: false,
      };
    }
    case ADD_POST_SUCCESS: {
      return {
        ...state,
        isAddingPost: false,
        mainPosts: [action.data, ...state.mainPosts],
        postAdded: true,
      };
    }
    case ADD_POST_FAILURE: {
      return {
        ...state,
        isAddingPost: false,
        addPostErrorReason: action.error,
      };
    }
    case ADD_COMMENT_REQUEST: {
      return {
        ...state,
        isAddingComment: true,
        addCommentErrorReason: '',
        commentAdded: false,
      };
    }
    case ADD_COMMENT_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
      const post = state.mainPosts[postIndex];
      const Comments = [...post.Comments, action.data.comment];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        isAddingComment: false,
        mainPosts,
        commentAdded: true,
      };
    }
    case ADD_COMMENT_FAILURE: {
      return {
        ...state,
        isAddingComment: false,
        addCommentErrorReason: action.error,
      };
    }
    case LOAD_MAIN_POSTS_REQUEST: {
      return {
        ...state,
        mainPosts: [],
      };
    }
    case LOAD_MAIN_POSTS_SUCCESS: {
      return {
        ...state,
        mainPosts: action.data,
      };
    }
    case LOAD_MAIN_POSTS_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

```

#### \front\reducers\user.js
```js

export const initialState = {
  isLoggingOut : false,
  isLogginIn : false,
  LoginInErrorReason: '',
  signedUp: false,
  isSigningUp: false,
  isSignedUp : false,
  signUpErrorReason: '',
  isSignUpSuccesFailure: false,
  me: null,
  followingList : [],
  followerList: [],
  userInfo: [],
};

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

export const LOAD_FOLLOW_REQUEST = 'LOAD_FOLLOW_REQUEST';
export const LOAD_FOLLOW_SUCCESS = 'LOAD_FOLLOW_SUCCESS';
export const LOAD_FOLLOW_FAILURE = 'LOAD_FOLLOW_FAILURE';

export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

export const REMOVE_USER_REQUEST = 'REMOVE_USER_REQUEST';
export const REMOVE_USER_SUCCESS = 'REMOVE_USER_SUCCESS';
export const REMOVE_USER_FAILURE = 'REMOVE_USER_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        isLoading : false,
        me: action.data,
      };
    }
    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        LoginInErrorReason : action.error,
        me: null,
      };
    }

    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggingOut: true,
      };
    }
    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        isLoggingOut: false,
        me: null
      };
    }
    case LOG_OUT_FAILURE: {
      return {
        ...state,
        isLoggingOut: false,
      };
    }

    case SIGN_UP_REQUEST: { 
      return { 
        ...state, 
        isSigningUp: true,
        isSignedUp: false,
        signUpErrorReason: '',
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_SUCCESS: { 
      return { 
        ...state, 
        isSigningUp: false,
        isSignedUp: true, 
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_FAILURE: { 
      return { 
        ...state, 
        isSigningUp : false,
        signUpErrorReason : action.error, 
        isSignUpSuccesFailure: true,
      }; 
    }
    
    case LOAD_USER_REQUEST: { 
      return { 
        ...state, 
      }; 
    }
    case LOAD_USER_SUCCESS: { 
      return { 
        ...state, 
        me : action.data, 
      }; 
    }
    case LOAD_USER_FAILURE: { 
      return { 
        ...state, 
      }; 
    } 

    default: {
      return {
        ...state,
      }
    }
  }
};
```


## getInitialProps로 서버 데이터 받기
[위로가기](#기능-완성해나가기)

#### \front\components\AppLayout.js (파일 명만 바꿔주기)
App.Layout(전) -> AppLayout(후) 

#### \front\pages\_app.js
```js
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import WithRedux from 'next-redux-wrapper';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'; 
import createSagaMiddleware from 'redux-saga';

import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas';

const NodeBird = ({ Component, store, pageProps }) => {
  return (
    <Provider store={store} > 
      <Head>
        <title>NodeBird</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
      </Head>
      <AppLayout >
        <Component {...pageProps} />
      </AppLayout>
    </Provider>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
};

NodeBird.getInitialProps = async (context) => {
  const { ctx, Component } = context;
  console.log(ctx);
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
};

const configureStore = (initalState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const enhancer = process.env.NODE_ENV === 'production' 
  ? compose( 
    applyMiddleware(...middlewares))
  : compose(
    applyMiddleware(...middlewares), 
      !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
  );

  const store = createStore(reducer, initalState, enhancer);
  sagaMiddleware.run(rootSaga); 
  return store;
}

export default WithRedux(configureStore)(NodeBird);
```

#### \front\pages\hashtag.js
```js
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

const Hashtag = ({ tag }) => {
  const dispatch = useDispatch();
  const { mainPosts } = useSelector(state => state.post);

  useEffect(() => {
    dispatch({
      type: LOAD_HASHTAG_POSTS_REQUEST,
      data: tag,
    });
  }, []);
  return (
    <div>
      {mainPosts.map(c => (
        <PostCard key={+c.createdAt} post={c} />
      ))}
    </div>
  );
};

Hashtag.propTypes = {
  tag: PropTypes.string.isRequired,
};

Hashtag.getInitialProps = async (context) => {
  console.log('hashtag getInitialProps', context.query.tag);
  return { tag: context.query.tag };
};

export default Hashtag;
```

#### \front\pages\user.js
```js
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card } from 'antd';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';
import PostCard from '../components/PostCard';

const User = ({ id }) => {
  const dispatch = useDispatch();
  const { mainPosts } = useSelector(state => state.post);
  const { userInfo } = useSelector(state => state.user);

  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST,
      type: id
    })
    dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: id,
    });
  }, []);
  
  return (
    <div>
      {userInfo
        ? (
          <Card
            actions={[
              <div key="twit">
                짹짹
                <br />
                {userInfo.Posts}
              </div>,
              <div key="following">
                팔로잉
                <br />
                {userInfo.Followings}
              </div>,
              <div key="follower">
                팔로워
                <br />
                {userInfo.Followers}
              </div>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
              title={userInfo.nickname}
            />
          </Card>
        )
        : null}
      {mainPosts.map(c => {
        <PostCard key={+c.createdAt} post={c} />
      })}
    </div>
  );
};

User.propTypes = {
  id: PropTypes.number.isRequired,
}

User.getInitialProps = async (context) => {
  console.log('user getInitialProps', context.query.id);
  return { id : parseInt(context.query.id, 10) } 
};

export default User;

```

#### \front\server.js
```js
const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

const app = next({ dev });
const handle = app.getRequestHandler();
dotenv.config();

app.prepare().then(() => {
  const server = express();

  server.use(morgan('dev'));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }));

  server.get('/hashtag/:tag', (req, res) => {
    return app.render(req, res, '/hashtag', { tag: req.params.tag });
  });

  server.get('/user/:id', (req, res) => {
    return app.render(req, res, '/user', { id: req.params.id });
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3060, () => {
    console.log('next+express running on port 3060');
  });
});
```


#### \front\components\PostCard.js (수정하였음)
```js
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from 'antd';
import Link from 'next/link'
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const PostCard = ({post}) => {

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
  }, []);
  
  const onSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!me) {
      return alert('로그인이 필요합니다.');
    };
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
      }
    })
    
  }, [me && me.id]);

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
  }, [commentAdded]);

  // useEffect(() => {
  //   setCommentText('');
  // }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.img && <img alt="example" src={post.img} />}
        actions={[
          <Icon type="retweet" key="retweet" />,
          <Icon type="heart" key="heart" />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
        extra={<Button>팔로우</Button>}
      >
        <Card.Meta 
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={(
            <div>
              {post.content.split(/(#[^\s]+)/g).map((v, i) => {
                if (v.match(/#[^\s]+/)) {
                  return (
                    <Link 
                      href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }} 
                      key={+v.createdAt}
                    >
                      <a>{v}</a>
                    </Link>
                  );
                }
                return v; 
              })};
            </div>
          )}
        />
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>클릭</Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={ item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )} 
    </div>
  )
};

PostCard.prototypes = {
  post: PropTypes.shape({
    User : PropTypes.object,
    content : PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.object,  
  }),
}

export default PostCard;
```

## 해시태그 검색, 유저 정보 라우터 만들기
[위로가기](#기능-완성해나가기)

#### \front\reducers\user.js
```js
...생략

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        isLoading : false,
        me: action.data,
      };
    }
    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        LoginInErrorReason : action.error,
        me: null,
      };
    }

    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggingOut: true,
      };
    }
    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        isLoggingOut: false,
        me: null
      };
    }
    case LOG_OUT_FAILURE: {
      return {
        ...state,
        isLoggingOut: false,
      };
    }

    case SIGN_UP_REQUEST: { 
      return { 
        ...state, 
        isSigningUp: true,
        isSignedUp: false,
        signUpErrorReason: '',
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_SUCCESS: { 
      return { 
        ...state, 
        isSigningUp: false,
        isSignedUp: true, 
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_FAILURE: { 
      return { 
        ...state, 
        isSigningUp : false,
        signUpErrorReason : action.error, 
        isSignUpSuccesFailure: true,
      }; 
    }
    
    case LOAD_USER_REQUEST: { 
      return { 
        ...state, 
      }; 
    }
    case LOAD_USER_SUCCESS: { 
      if (action.me) {
        return { 
          ...state, 
          me : action.data, 
        }; 
      }
      return {
        ...state,
        userInfo: action.data
      }
    }
    case LOAD_USER_FAILURE: { 
      return { 
        ...state, 
      }; 
    } 

    default: {
      return {
        ...state,
      }
    }
  }
};
```

#### \front\sagas\post.js
```js
import axios from 'axios';
import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects';
import { 
  ADD_POST_REQUEST, ADD_POST_FAILURE, ADD_POST_SUCCESS, 
  ADD_COMMENT_SUCCESS, ADD_COMMENT_REQUEST, ADD_COMMENT_FAILURE, 
  LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE, LOAD_MAIN_POSTS_REQUEST, LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE, LOAD_USER_POSTS_REQUEST 
} from '../reducers/post';


function* AddCommentAPI() {

}
function* AddComment(action) { 
  try {
    yield delay(2000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId, 
      }
    })
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e
    })
  }
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, AddComment);
}


function addPostAPI(postData) {
  return axios.post('/post', postData, {
    withCredentials: true,
  });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}


function loadMainPostsAPI() {
  return axios.get('/posts');
}

function* loadMainPosts() {
  try {
    const result = yield call(loadMainPostsAPI);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadMainPosts);
}


function loadHashtagPostsAPI(tag) {
  return axios.get(`/hashtag/${tag}`);
}

function* loadHashtagPosts() {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}


function loadUserPostsAPI(id) {
  return axios.get(`/posts/${id}/posts`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadMainPosts),
    fork(watchAddComment),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
  ]);
}
```

#### \front\sagas\user.js
```js
import axios from 'axios';
import { all, fork, takeLatest, call, put, takeEvery } from 'redux-saga/effects';
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST } from '../reducers/user'

function logInAPI(logInData) {
  return axios.post('/user/login', logInData, {
    withCredentials: true, 
  });
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data
    })
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    })
  }
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function signUpAPI(signUpdata) {
  return axios.post('/user/', signUpdata);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data); 
    yield put({
      type: SIGN_UP_SUCCESS
    });
  } catch (err) {
    console.error(err)
    yield put({ 
      type : SIGN_UP_FAILURE,
      error : err.response.data,
    });
  }
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}


function logOutAPI() {
  return axios.post('/user/logout', {}, { 
    withCredentials: true, 
  }); 
  
}

function* logOut() {
  try {
    yield call(logOutAPI); 
    yield put({
      type: LOG_OUT_SUCCESS
    });
  } catch (err) {
    console.error(err);
    yield put({ 
      type : LOG_OUT_FAILURE,
      error : err,
    });
  }
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}



function loadUserAPI(userId) {
  return axios.get( userId ? `/user/${userId}` : `/user/`, {
    withCredentials: true,
  });
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}


export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut), 
    fork(watchLoadUser), 
    fork(watchSignUp)
  ]);
}
```


## Link 컴포넌트 고급 사용법
[위로가기](#기능-완성해나가기)

많이 수정했는데, README.md를 보면서 해결하면 될 것이다.

#### \front\components\PostCard.js
```js
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from 'antd';
import Link from 'next/link'
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const PostCard = ({post}) => {

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
  }, []);
  
  const onSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!me) {
      return alert('로그인이 필요합니다.');
    };
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
      }
    })
    
  }, [me && me.id]);

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
  }, [commentAdded]);

  // useEffect(() => {
  //   setCommentText('');
  // }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.img && <img alt="example" src={post.img} />}
        actions={[
          <Icon type="retweet" key="retweet" />,
          <Icon type="heart" key="heart" />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
        extra={<Button>팔로우</Button>}
      >
        <Card.Meta 
          avatar={(
            <Link href={{ pathname: '/user', query: { id: post.User.id } }} as={`/user/${post.User.id}`}>
              <a><Avatar>{post.User.nickname[0]}</Avatar></a>
            </Link>)}
          title={post.User.nickname}
          description={(
            <div>
              {post.content.split(/(#[^\s]+)/g).map((v, i) => {
                if (v.match(/#[^\s]+/)) {
                  return (
                    <Link 
                      href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
                      as={`/hashtag/${v.slice(1)}`} 
                      key={+v.createdAt}
                    >
                      <a>{v}</a>
                    </Link>
                  );
                }
                return v; 
              })};
            </div>
          )}
        />
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>클릭</Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={ item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.user.id}`} >
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )} 
    </div>
  )
};

PostCard.prototypes = {
  post: PropTypes.shape({
    User : PropTypes.object,
    content : PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.object,  
  }),
}

export default PostCard;


```

## 댓글 작성, 댓글 로딩
[위로가기](#기능-완성해나가기)

#### \front\components\PostCard.js
```js
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from 'antd';
import Link from 'next/link'
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST } from '../reducers/post';

const PostCard = ({post}) => {

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, [commentFormOpened]);
  
  const onSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!me) {
      return alert('로그인이 필요합니다.');
    };
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText,
      }
    })
    
  }, [me && me.id, commentText]);

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
  }, [commentAdded]);

  // useEffect(() => {
  //   setCommentText('');
  // }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.img && <img alt="example" src={post.img} />}
        actions={[
          <Icon type="retweet" key="retweet" />,
          <Icon type="heart" key="heart" />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
        extra={<Button>팔로우</Button>}
      >
        <Card.Meta 
          avatar={(
            <Link href={{ pathname: '/user', query: { id: post.User.id } }} as={`/user/${post.User.id}`}>
              <a><Avatar>{post.User.nickname[0]}</Avatar></a>
            </Link>)}
          title={post.User.nickname}
          description={(
            <div>
              {post.content.split(/(#[^\s]+)/g).map((v, i) => {
                if (v.match(/#[^\s]+/)) {
                  return (
                    <Link 
                      href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
                      as={`/hashtag/${v.slice(1)}`} 
                      key={+v.createdAt}
                    >
                      <a>{v}</a>
                    </Link>
                  );
                }
                return v; 
              })};
            </div>
          )}
        />
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>클릭</Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={ item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )} 
    </div>
  )
};

PostCard.prototypes = {
  post: PropTypes.shape({
    User : PropTypes.object,
    content : PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.object,  
  }),
}

export default PostCard;


```

#### \front\reducers\post.js
```js
export const initialState = {
  mainPosts: [],
  imagePaths: [],
  addPostErrorReason: '',
  isAddingPost: false,
  postAdded: false,
  isAddingComment: false,
  addCommentErrorReason: '',
  commentAdded: false,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const LOAD_MAIN_REQUEST = 'LOAD_MAIN_REQUEST';
export const LOAD_MAIN_SUCCESS = 'LOAD_MAIN_SUCCESS';
export const LOAD_MAIN_FAILURE = 'LOAD_MAIN_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const LOAD_COMMENTS_FAILURE = 'LOAD_COMMENTS_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const UPDATE_POST_REQUEST = 'UPDATE_POST_REQUEST';
export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
export const UPDATE_POST_FAILURE = 'UPDATE_POST_FAILURE';

export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';


export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST: {
      return {
        ...state,
        isAddingPost: true,
        addPostErrorReason: '',
        postAdded: false,
      };
    }
    case ADD_POST_SUCCESS: {
      return {
        ...state,
        isAddingPost: false,
        mainPosts: [action.data, ...state.mainPosts],
        postAdded: true,
      };
    }
    case ADD_POST_FAILURE: {
      return {
        ...state,
        isAddingPost: false,
        addPostErrorReason: action.error,
      };
    }
    case ADD_COMMENT_REQUEST: {
      return {
        ...state,
        isAddingComment: true,
        addCommentErrorReason: '',
        commentAdded: false,
      };
    }
    case ADD_COMMENT_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
      const post = state.mainPosts[postIndex];
      const Comments = [...post.Comments, action.data.comment];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        isAddingComment: false,
        mainPosts,
        commentAdded: true,
      };
    }
    case ADD_COMMENT_FAILURE: {
      return {
        ...state,
        isAddingComment: false,
        addCommentErrorReason: action.error,
      };
    }
    case LOAD_COMMENTS_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId
      );
      const post = state.mainPosts[postIndex];
      const Comments = action.data.comments;
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        mainPosts
      };
    }
    case LOAD_MAIN_POSTS_REQUEST:
    case LOAD_HASHTAG_POSTS_REQUEST:
    case LOAD_USER_POSTS_REQUEST: {
      return {
        ...state,
        mainPosts: [],
      };
    }
    case LOAD_MAIN_POSTS_SUCCESS:
    case LOAD_HASHTAG_POSTS_SUCCESS:
    case LOAD_USER_POSTS_SUCCESS: {
      return {
        ...state,
        mainPosts: action.data,
      };
    }
    case LOAD_MAIN_POSTS_FAILURE:yy
    case LOAD_HASHTAG_POSTS_FAILURE:yy
    case LOAD_USER_POSTS_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

```

#### \front\sagas\post.js
```js
import axios from 'axios';
import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects';
import { 
  ADD_POST_REQUEST, ADD_POST_FAILURE, ADD_POST_SUCCESS, 
  ADD_COMMENT_SUCCESS, ADD_COMMENT_REQUEST, ADD_COMMENT_FAILURE, 
  LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE, LOAD_MAIN_POSTS_REQUEST, LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE, LOAD_USER_POSTS_REQUEST, LOAD_COMMENTS_FAILURE, LOAD_COMMENTS_REQUEST, LOAD_COMMENTS_SUCCESS 
} from '../reducers/post';


function AddCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, { content: data.content }, {
    withCredentials: true,
  });
}
function* AddComment(action) { 
  try {
    const result = yield call(AddCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId, 
        comment: result.data,
      }
    })
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e
    })
  }
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, AddComment);
}

function loadCommentsAPI(postId) {
  return axios.get(`/post/${postId}/comments`);
}

function* loadComments(action) {
  try {
    const result = yield call(loadCommentsAPI, action.data);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        postId: action.data,
        comments: result.data
      }
    });
  } catch (e) {
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error: e
    });
  }
}

function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}


function addPostAPI(postData) {
  return axios.post('/post', postData, {
    withCredentials: true,
  });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}


function loadMainPostsAPI() {
  return axios.get('/posts');
}

function* loadMainPosts() {
  try {
    const result = yield call(loadMainPostsAPI);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}


function loadHashtagPostsAPI(tag) {
  return axios.get(`/hashtag/${tag}`);
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}


function loadUserPostsAPI(id) {
  return axios.get(`/user/${id}/posts`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadMainPosts),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
  ]);
}
```

## 미들웨어로 중복 제거하기
[위로가기](#기능-완성해나가기)


코드 없음

## 이미지 업로드 프론트 구현하기
[위로가기](#기능-완성해나가기)

#### \front\components\PostForm.js
```js
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST } from '../reducers/post';

const PostForm = () => {
  const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const imageInput = useRef();

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요!');
    }
    dispatch({
      type: ADD_POST_REQUEST,
      data: {
        content: text,
      },
    });
  }, [text]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  useEffect(() => {
    if (postAdded) {
      setText('');
    }
  }, [postAdded]);

  const onChangeImages = useCallback((e) => {
    console.log(e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click(); 
  
  }, [imageInput.current]);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/fomr-data" onSubmit={onSubmitForm}>
      <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?" value={text} onChange={onChangeText} />  
      <div>
        <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload} >이미지 업로드</Button>
        <Button type="primary" style={{ float : 'right'}} htmlType="submit" loading={isAddingPost} >업로드</Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: 'inline-black' }}>
            <img src={`http://localhost:3065/${v}`} style={{ width : '200px' }} alt={v} />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}  
      </div>  
  </Form>
  )
}

export default PostForm;
```

#### \front\sagas\post.js
```js
import axios from 'axios';
import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects';
import { 
  ADD_POST_REQUEST, ADD_POST_FAILURE, ADD_POST_SUCCESS, 
  ADD_COMMENT_SUCCESS, ADD_COMMENT_REQUEST, ADD_COMMENT_FAILURE, 
  LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE, LOAD_MAIN_POSTS_REQUEST, LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE, LOAD_USER_POSTS_REQUEST, LOAD_COMMENTS_FAILURE, LOAD_COMMENTS_REQUEST, LOAD_COMMENTS_SUCCESS, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE, UPLOAD_IMAGES_REQUEST 
} from '../reducers/post';


function AddCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, { content: data.content }, {
    withCredentials: true,
  });
}
function* AddComment(action) { 
  try {
    const result = yield call(AddCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId, 
        comment: result.data,
      }
    })
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e
    })
  }
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, AddComment);
}

function loadCommentsAPI(postId) {
  return axios.get(`/post/${postId}/comments`);
}

function* loadComments(action) {
  try {
    const result = yield call(loadCommentsAPI, action.data);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        postId: action.data,
        comments: result.data
      }
    });
  } catch (e) {
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error: e
    });
  }
}

function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}


function addPostAPI(postData) {
  return axios.post('/post', postData, {
    withCredentials: true,
  });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}


function loadMainPostsAPI() {
  return axios.get('/posts');
}

function* loadMainPosts() {
  try {
    const result = yield call(loadMainPostsAPI);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}


function loadHashtagPostsAPI(tag) {
  return axios.get(`/hashtag/${tag}`);
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}


function loadUserPostsAPI(id) {
  return axios.get(`/user/${id}/posts`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function uploadImagesAPI(formData) {
  return axios.post(`/post/images`, formData ,{
    withCredentials: true,
  });
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: e,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadMainPosts),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
    fork(watchUploadImages),
  ]);
}
```

#### \front\reducers\post.js
```js
export const initialState = {
  mainPosts: [],
  imagePaths: [],
  addPostErrorReason: '',
  isAddingPost: false,
  postAdded: false,
  isAddingComment: false,
  addCommentErrorReason: '',
  commentAdded: false,
};

...생략

export default (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_IMAGES_REQUEST: {
      return {
        ...state,
      };
    }
    case UPLOAD_IMAGES_SUCCESS: {
      return {
        ...state,
        imagePaths: [...state.imagePaths, ...action.data],
      };
    }
    case UPLOAD_IMAGES_FAILURE: {
      return {
        ...state,
      };
    }
    case ADD_POST_REQUEST: {
      return {
        ...state,
        isAddingPost: true,
        addPostErrorReason: '',
        postAdded: false,
      };
    }
    case ADD_POST_SUCCESS: {
      return {
        ...state,
        isAddingPost: false,
        mainPosts: [action.data, ...state.mainPosts],
        postAdded: true,
      };
    }
    case ADD_POST_FAILURE: {
      return {
        ...state,
        isAddingPost: false,
        addPostErrorReason: action.error,
      };
    }
    case ADD_COMMENT_REQUEST: {
      return {
        ...state,
        isAddingComment: true,
        addCommentErrorReason: '',
        commentAdded: false,
      };
    }
    case ADD_COMMENT_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
      const post = state.mainPosts[postIndex];
      const Comments = [...post.Comments, action.data.comment];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        isAddingComment: false,
        mainPosts,
        commentAdded: true,
      };
    }
    case ADD_COMMENT_FAILURE: {
      return {
        ...state,
        isAddingComment: false,
        addCommentErrorReason: action.error,
      };
    }
    case LOAD_COMMENTS_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId
      );
      const post = state.mainPosts[postIndex];
      const Comments = action.data.comments;
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        mainPosts
      };
    }
    case LOAD_MAIN_POSTS_REQUEST:
    case LOAD_HASHTAG_POSTS_REQUEST:
    case LOAD_USER_POSTS_REQUEST: {
      return {
        ...state,
        mainPosts: [],
      };
    }
    case LOAD_MAIN_POSTS_SUCCESS:
    case LOAD_HASHTAG_POSTS_SUCCESS:
    case LOAD_USER_POSTS_SUCCESS: {
      return {
        ...state,
        mainPosts: action.data,
      };
    }
    case LOAD_MAIN_POSTS_FAILURE:yy
    case LOAD_HASHTAG_POSTS_FAILURE:yy
    case LOAD_USER_POSTS_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

```

## multer로 이미지 업로드 받기
[위로가기](#기능-완성해나가기)

코드없음

## express static과 이미지 제거
[위로가기](#기능-완성해나가기)

#### \front\components\PostForm.js
```js
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';

const PostForm = () => {
  const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const imageInput = useRef();

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요!');
    }
    dispatch({
      type: ADD_POST_REQUEST,
      data: {
        content: text,
      },
    });
  }, [text]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  useEffect(() => {
    if (postAdded) {
      setText('');
    }
  }, [postAdded]);

  const onChangeImages = useCallback((e) => {
    console.log(e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click(); 
  }, [imageInput.current]);

  const onRemoveImage = useCallback( index => () => {
    dispatch({
      type: REMOVE_IMAGE,
      index,
    })
  }, []);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/fomr-data" onSubmit={onSubmitForm}>
      <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?" value={text} onChange={onChangeText} />  
      <div>
        <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload} >이미지 업로드</Button>
        <Button type="primary" style={{ float : 'right'}} htmlType="submit" loading={isAddingPost} >업로드</Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-black' }}>
            <img src={`http://localhost:3065/${v}`} style={{ width : '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}  
      </div>  
  </Form>
  )
}

export default PostForm;
```

#### \front\reducers\post.js
```js
export const initialState = {
  mainPosts: [],
  imagePaths: [],
  addPostErrorReason: '',
  isAddingPost: false,
  postAdded: false,
  isAddingComment: false,
  addCommentErrorReason: '',
  commentAdded: false,
};

...생략

export default (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_IMAGES_REQUEST: {
      return {
        ...state,
      };
    }
    case UPLOAD_IMAGES_SUCCESS: {
      return {
        ...state,
        imagePaths: [...state.imagePaths, ...action.data],
      };
    }
    case UPLOAD_IMAGES_FAILURE: {
      return {
        ...state,
      };
    }
    case REMOVE_IMAGE: {
      return {
        ...state,
        imagePaths: state.imagePaths.filter((v, i) => i !== action.index),
      }
    }
    case ADD_POST_REQUEST: {
      return {
        ...state,
        isAddingPost: true,
        addPostErrorReason: '',
        postAdded: false,
      };
    }
    case ADD_POST_SUCCESS: {
      return {
        ...state,
        isAddingPost: false,
        mainPosts: [action.data, ...state.mainPosts],
        postAdded: true,
      };
    }
    case ADD_POST_FAILURE: {
      return {
        ...state,
        isAddingPost: false,
        addPostErrorReason: action.error,
      };
    }
    case ADD_COMMENT_REQUEST: {
      return {
        ...state,
        isAddingComment: true,
        addCommentErrorReason: '',
        commentAdded: false,
      };
    }
    case ADD_COMMENT_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
      const post = state.mainPosts[postIndex];
      const Comments = [...post.Comments, action.data.comment];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        isAddingComment: false,
        mainPosts,
        commentAdded: true,
      };
    }
    case ADD_COMMENT_FAILURE: {
      return {
        ...state,
        isAddingComment: false,
        addCommentErrorReason: action.error,
      };
    }
    case LOAD_COMMENTS_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId
      );
      const post = state.mainPosts[postIndex];
      const Comments = action.data.comments;
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        mainPosts
      };
    }
    case LOAD_MAIN_POSTS_REQUEST:
    case LOAD_HASHTAG_POSTS_REQUEST:
    case LOAD_USER_POSTS_REQUEST: {
      return {
        ...state,
        mainPosts: [],
      };
    }
    case LOAD_MAIN_POSTS_SUCCESS:
    case LOAD_HASHTAG_POSTS_SUCCESS:
    case LOAD_USER_POSTS_SUCCESS: {
      return {
        ...state,
        mainPosts: action.data,
      };
    }
    case LOAD_MAIN_POSTS_FAILURE:yy
    case LOAD_HASHTAG_POSTS_FAILURE:yy
    case LOAD_USER_POSTS_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

```

## 폼데이터로 게시글 올리기
[위로가기](#기능-완성해나가기)

#### \front\components\PostForm.js
```js
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';

const PostForm = () => {
  const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const imageInput = useRef();

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요!');
    }
    const formData = new FormData();
    imagePaths.forEach((i) => {
      formData.append('image', i);
    });
    formData.append('content', text);
    dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  useEffect(() => {
    if (postAdded) {
      setText('');
    }
  }, [postAdded]);

  const onChangeImages = useCallback((e) => {
    console.log(e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click(); 
  }, [imageInput.current]);

  const onRemoveImage = useCallback( index => () => {
    dispatch({
      type: REMOVE_IMAGE,
      index,
    })
  }, []);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/fomr-data" onSubmit={onSubmitForm}>
      <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?" value={text} onChange={onChangeText} />  
      <div>
        <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload} >이미지 업로드</Button>
        <Button type="primary" style={{ float : 'right'}} htmlType="submit" loading={isAddingPost} >업로드</Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-black' }}>
            <img src={`http://localhost:3065/${v}`} style={{ width : '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}  
      </div>  
  </Form>
  )
}

export default PostForm;
```

#### \front\reducers\post.js
```js
...생략

export default (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_IMAGES_REQUEST: {
      return {
        ...state,
      };
    }
    case UPLOAD_IMAGES_SUCCESS: {
      return {
        ...state,
        imagePaths: [...state.imagePaths, ...action.data],
      };
    }
    case UPLOAD_IMAGES_FAILURE: {
      return {
        ...state,
      };
    }
    case REMOVE_IMAGE: {
      return {
        ...state,
        imagePaths: state.imagePaths.filter((v, i) => i !== action.index),
      }
    }
    case ADD_POST_REQUEST: {
      return {
        ...state,
        isAddingPost: true,
        addPostErrorReason: '',
        postAdded: false,
      };
    }
    case ADD_POST_SUCCESS: {
      return {
        ...state,
        isAddingPost: false,
        mainPosts: [action.data, ...state.mainPosts],
        postAdded: true,
        imagePaths: [], // 이 부부문 추가...
      };
    }
    case ADD_POST_FAILURE: {
      return {
        ...state,
        isAddingPost: false,
        addPostErrorReason: action.error,
      };
    }
    case ADD_COMMENT_REQUEST: {
      return {
        ...state,
        isAddingComment: true,
        addCommentErrorReason: '',
        commentAdded: false,
      };
    }
    case ADD_COMMENT_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
      const post = state.mainPosts[postIndex];
      const Comments = [...post.Comments, action.data.comment];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        isAddingComment: false,
        mainPosts,
        commentAdded: true,
      };
    }
    case ADD_COMMENT_FAILURE: {
      return {
        ...state,
        isAddingComment: false,
        addCommentErrorReason: action.error,
      };
    }
    case LOAD_COMMENTS_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId
      );
      const post = state.mainPosts[postIndex];
      const Comments = action.data.comments;
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        mainPosts
      };
    }
    case LOAD_MAIN_POSTS_REQUEST:
    case LOAD_HASHTAG_POSTS_REQUEST:
    case LOAD_USER_POSTS_REQUEST: {
      return {
        ...state,
        mainPosts: [],
      };
    }
    case LOAD_MAIN_POSTS_SUCCESS:
    case LOAD_HASHTAG_POSTS_SUCCESS:
    case LOAD_USER_POSTS_SUCCESS: {
      return {
        ...state,
        mainPosts: action.data,
      };
    }
    case LOAD_MAIN_POSTS_FAILURE:yy
    case LOAD_HASHTAG_POSTS_FAILURE:yy
    case LOAD_USER_POSTS_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

```

## 게시글 이미지 표시하기
[위로가기](#기능-완성해나가기)

#### \front\components\PostCard.js
```js
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from 'antd';
import Link from 'next/link'
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST } from '../reducers/post';
import PostImages from './PostImages';

const PostCard = ({post}) => {

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, [commentFormOpened]);
  
  const onSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!me) {
      return alert('로그인이 필요합니다.');
    };
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText,
      }
    })
    
  }, [me && me.id, commentText]);

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
  }, [commentAdded]);

  // useEffect(() => {
  //   setCommentText('');
  // }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <Icon type="retweet" key="retweet" />,
          <Icon type="heart" key="heart" />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
        extra={<Button>팔로우</Button>}
      >
        <Card.Meta 
          avatar={(
            <Link href={{ pathname: '/user', query: { id: post.User.id } }} as={`/user/${post.User.id}`}>
              <a><Avatar>{post.User.nickname[0]}</Avatar></a>
            </Link>)}
          title={post.User.nickname}
          description={(
            <div>
              {post.content.split(/(#[^\s]+)/g).map((v, i) => {
                if (v.match(/#[^\s]+/)) {
                  return (
                    <Link 
                      href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
                      as={`/hashtag/${v.slice(1)}`} 
                      key={+v.createdAt}
                    >
                      <a>{v}</a>
                    </Link>
                  );
                }
                return v; 
              })};
            </div>
          )}
        />
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>클릭</Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={ item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )} 
    </div>
  )
};

PostCard.prototypes = {
  post: PropTypes.shape({
    User : PropTypes.object,
    content : PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.object,  
  }),
}

export default PostCard;


```

#### \front\components\PostImages.js
```js
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

const PostImages = ({ images }) => {
  if ( images.length === 1 ) {
    return (
      <img src={`http://localhost:3065/${images[0].src}`} />
    );
  } 
  if ( images.length === 2 ) {
   return (
    <div>
      <img src={`http://localhost:3065/${images[0].src}`} width="50%" />
      <img src={`http://localhost:3065/${images[1].src}`} width="50%" />
    </div>
   ); 
  } 
  return (
    <div>
      <img src={`http://localhost:3065/${images[0].src}`} width="50%" />
      <div style={{ display: 'inline-block', width: "50%", textAlign: 'center', verticalAlign: 'center'}} >
        <Icon type="plus" />
        <br />
        {images.length - 1}
        개의 사진 더보기
      </div>
    </div>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({ 
    src: PropTypes.string,
  })).isRequired,
}

export default PostImages;
```

## react slick으로 이미지 슬라이더 구현
[위로가기](#기능-완성해나가기)

#### \front\components\PostImages.js
```JS
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import ImagesZoom from './ImagesZoom';

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);
  
  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, [showImagesZoom]);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, [showImagesZoom]);

  if ( images.length === 1 ) {
    return (
      <>
        <img src={`http://localhost:3065/${images[0].src}`} onClick={onZoom} />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  } 
  if ( images.length === 2 ) {
    return (
      <>
        <div>
          <img src={`http://localhost:3065/${images[0].src}`} width="50%" onClick={onZoom} />
          <img src={`http://localhost:3065/${images[1].src}`} width="50%" onClick={onZoom} />
        </div>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    ); 
  } 
  return (
    <>
      <div>
        <img src={`http://localhost:3065/${images[0].src}`} width="50%" onClick={onZoom} />
        <div style={{ display: 'inline-block', width: "50%", textAlign: 'center', verticalAlign: 'center'}} onClick={onZoom} >
          <Icon type="plus" />
          <br />
          {images.length - 1}
          개의 사진 더보기
        </div>
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({ 
    src: PropTypes.string,
  })).isRequired,
}

export default PostImages;
```

#### \front\components\ImagesZoom.js
```js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Slick from 'react-slick'

const ImagesZoom = ({ images, onClose }) => {
  
  const [currentSlide, setCurrentSlide] = useState(0); 

  return (
    <div style={{ position: 'fixed', zIndex: 5000, top: 0, left: 0, right: 0, bottom: 0 }}>
      <header style={{ height: 44, background: 'white', position: 'relative', padding: 0, textAlign: 'center'}}>
        <h1 style={{ margin: 0, fontSize: '17px', color: '#333', lineHeight: '44px' }}>상세 이미지</h1>
        <Icon type="close" onClick={onClose} style={{ position: 'absolute', right: 0, top: 0, padding: 15, lineHeight: '14px', cursor: 'pointer' }} />
      </header>
      <div style={{ height: 'calc(100% - 44px)', background: '#090909' }}>
        <div>
          <Slick
            initialSlide={0}
            afterChange={slide => setCurrentSlide(slide)}
            infinite={false}
            arrows
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((v) => {
              return (
                <div style={{ padding: 32, textAlign: 'center' }}>
                  <img src={`http://localhost:3065/${v.src}`} style={{ margin: '0 auto', maxHeight: 750 }} />
                </div>
              );
            })}
          </Slick>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 75, height: 30, lineHeight: '30px', borderRadius: 15, background: '#313131', display: 'inline-block', textAlign: 'center', color: 'white', fontSize: '15px' }}>
              {currentSlide + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
```

#### \front\pages\_app.js
```js
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import WithRedux from 'next-redux-wrapper';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'; 
import createSagaMiddleware from 'redux-saga';

import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas';

const NodeBird = ({ Component, store, pageProps }) => {
  return (
    <Provider store={store} > 
      <Head>
        <title>NodeBird</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
        {/* 이미지 슬라이드를 하기위해서 밑에 2개를 추가해줘야한다. */}
        <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head>
      <AppLayout >
        <Component {...pageProps} />
      </AppLayout>
    </Provider>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
};

NodeBird.getInitialProps = async (context) => {
  const { ctx, Component } = context;
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
};

const configureStore = (initalState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const enhancer = process.env.NODE_ENV === 'production' 
  ? compose( 
    applyMiddleware(...middlewares))
  : compose(
    applyMiddleware(...middlewares), 
      !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
  );

  const store = createStore(reducer, initalState, enhancer);
  sagaMiddleware.run(rootSaga); 
  return store;
}

export default WithRedux(configureStore)(NodeBird);
```

## 게시글 좋아요, 좋아요 취소
[위로가기](#기능-완성해나가기)

#### \front\components\PostCard.js
```js
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from 'antd';
import Link from 'next/link'
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST } from '../reducers/post';
import PostImages from './PostImages';

const PostCard = ({post}) => {

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, [commentFormOpened]);
  
  const onSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!me) {
      return alert('로그인이 필요합니다.');
    };
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText,
      }
    })
    
  }, [me && me.id, commentText]);

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
  }, [commentAdded]);

  // useEffect(() => {
  //   setCommentText('');
  // }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  const onToggleLike = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다!');
    }
    if (liked) {
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else {
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [me && me.id, post && post.id, liked]);

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <Icon type="retweet" key="retweet" />,
          <Icon
            type="heart"
            key="heart"
            theme={liked ? 'twoTone' : 'outlined'}
            twoToneColor="#eb2f96"
            onClick={onToggleLike}
          />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
        extra={<Button>팔로우</Button>}
      >
        <Card.Meta 
          avatar={(
            <Link href={{ pathname: '/user', query: { id: post.User.id } }} as={`/user/${post.User.id}`}>
              <a><Avatar>{post.User.nickname[0]}</Avatar></a>
            </Link>)}
          title={post.User.nickname}
          description={(
            <div>
              {post.content.split(/(#[^\s]+)/g).map((v, i) => {
                if (v.match(/#[^\s]+/)) {
                  return (
                    <Link 
                      href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
                      as={`/hashtag/${v.slice(1)}`} 
                      key={+v.createdAt}
                    >
                      <a>{v}</a>
                    </Link>
                  );
                }
                return v; 
              })};
            </div>
          )}
        />
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>클릭</Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={ item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )} 
    </div>
  )
};

PostCard.prototypes = {
  post: PropTypes.shape({
    User : PropTypes.object,
    content : PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.object,  
  }),
}

export default PostCard;


```

#### \front\reducers\post.js
```js
...생략


export default (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_IMAGES_REQUEST: {
      return {
        ...state,
      };
    }
    case UPLOAD_IMAGES_SUCCESS: {
      return {
        ...state,
        imagePaths: [...state.imagePaths, ...action.data],
      };
    }
    case UPLOAD_IMAGES_FAILURE: {
      return {
        ...state,
      };
    }
    case REMOVE_IMAGE: {
      return {
        ...state,
        imagePaths: state.imagePaths.filter((v, i) => i !== action.index),
      }
    }
    case ADD_POST_REQUEST: {
      return {
        ...state,
        isAddingPost: true,
        addPostErrorReason: '',
        postAdded: false,
      };
    }
    case ADD_POST_SUCCESS: {
      return {
        ...state,
        isAddingPost: false,
        mainPosts: [action.data, ...state.mainPosts],
        postAdded: true,
        imagePaths: [],
      };
    }
    case ADD_POST_FAILURE: {
      return {
        ...state,
        isAddingPost: false,
        addPostErrorReason: action.error,
      };
    }
    case ADD_COMMENT_REQUEST: {
      return {
        ...state,
        isAddingComment: true,
        addCommentErrorReason: '',
        commentAdded: false,
      };
    }
    case ADD_COMMENT_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
      const post = state.mainPosts[postIndex];
      const Comments = [...post.Comments, action.data.comment];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        isAddingComment: false,
        mainPosts,
        commentAdded: true,
      };
    }
    case ADD_COMMENT_FAILURE: {
      return {
        ...state,
        isAddingComment: false,
        addCommentErrorReason: action.error,
      };
    }
    case LOAD_COMMENTS_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId
      );
      const post = state.mainPosts[postIndex];
      const Comments = action.data.comments;
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        mainPosts
      };
    }
    case LOAD_MAIN_POSTS_REQUEST:
    case LOAD_HASHTAG_POSTS_REQUEST:
    case LOAD_USER_POSTS_REQUEST: {
      return {
        ...state,
        mainPosts: [],
      };
    }
    case LOAD_MAIN_POSTS_SUCCESS:
    case LOAD_HASHTAG_POSTS_SUCCESS:
    case LOAD_USER_POSTS_SUCCESS: {
      return {
        ...state,
        mainPosts: action.data,
      };
    }
    case LOAD_MAIN_POSTS_FAILURE:yy
    case LOAD_HASHTAG_POSTS_FAILURE:yy
    case LOAD_USER_POSTS_FAILURE: {
      return {
        ...state,
      };
    }
    case LIKE_POST_REQUEST: {
      return {
        ...state,
      };
    }
    case LIKE_POST_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId
      );
      const post = state.mainPosts[postIndex];
      const Likers = [{ id: action.data.userId}, ...post.Likers]; 
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Likers };
      return {
        ...state,
        mainPosts,
      };
    }
    case LIKE_POST_FAILURE: {
      return {
        ...state,
      };
    }
    case UNLIKE_POST_REQUEST: {
      return {
        ...state,
      };
    }
    case UNLIKE_POST_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
      const post = state.mainPosts[postIndex];
      const Likers = post.Likers.filter(v => v.id !== action.data.userId);
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Likers };
      return {
        ...state,
        mainPosts,
      };
    }
    case UNLIKE_POST_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

```

#### \front\sagas\post.js
```js
import axios from 'axios';
import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects';
import { 
  ADD_POST_REQUEST, ADD_POST_FAILURE, ADD_POST_SUCCESS, 
  ADD_COMMENT_SUCCESS, ADD_COMMENT_REQUEST, ADD_COMMENT_FAILURE, 
  LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE, LOAD_MAIN_POSTS_REQUEST, LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE, LOAD_USER_POSTS_REQUEST, LOAD_COMMENTS_FAILURE, LOAD_COMMENTS_REQUEST, LOAD_COMMENTS_SUCCESS, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE, UPLOAD_IMAGES_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE, LIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE, UNLIKE_POST_REQUEST 
} from '../reducers/post';


function AddCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, { content: data.content }, {
    withCredentials: true,
  });
}
function* AddComment(action) { 
  try {
    const result = yield call(AddCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId, 
        comment: result.data,
      }
    })
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e
    })
  }
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, AddComment);
}

function loadCommentsAPI(postId) {
  return axios.get(`/post/${postId}/comments`);
}

function* loadComments(action) {
  try {
    const result = yield call(loadCommentsAPI, action.data);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        postId: action.data,
        comments: result.data
      }
    });
  } catch (e) {
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error: e
    });
  }
}

function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}


function addPostAPI(postData) {
  return axios.post('/post', postData, {
    withCredentials: true,
  });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}


function loadMainPostsAPI() {
  return axios.get('/posts');
}

function* loadMainPosts() {
  try {
    const result = yield call(loadMainPostsAPI);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}


function loadHashtagPostsAPI(tag) {
  return axios.get(`/hashtag/${tag}`);
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}


function loadUserPostsAPI(id) {
  return axios.get(`/user/${id}/posts`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function uploadImagesAPI(formData) {
  return axios.post(`/post/images`, formData ,{
    withCredentials: true,
  });
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: e,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function likePostAPI(postId) {
  return axios.post(`/post/${postId}/like`, {} ,{
    withCredentials: true,
  });
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId,
      }
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function unlikePostAPI(postId) {
  return axios.delete(`/post/${postId}/unlike`, {
    withCredentials: true,
  });
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: { 
        postId: action.data,
        userId: result.data.userId,
      }
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadMainPosts),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
  ]);
}
```

## 리트윗 API 만들기
[위로가기](#기능-완성해나가기)

#### \front\components\PostCard.js
```js
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from 'antd';
import Link from 'next/link'
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import PostImages from './PostImages';

const PostCard = ({post}) => {

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, [commentFormOpened]);
  
  const onSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!me) {
      return alert('로그인이 필요합니다.');
    };
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText,
      }
    })
    
  }, [me && me.id, commentText]);

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
  }, [commentAdded]);

  // useEffect(() => {
  //   setCommentText('');
  // }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  const onToggleLike = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다!');
    }
    if (liked) {
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else {
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [me && me.id, post && post.id, liked]);

  const onRetweet = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    })
  }, [me && me.id, post && post.id]);

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <Icon type="retweet" key="retweet" onClick={onRetweet} />,
          <Icon
            type="heart"
            key="heart"
            theme={liked ? 'twoTone' : 'outlined'}
            twoToneColor="#eb2f96"
            onClick={onToggleLike}
          />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
        extra={<Button>팔로우</Button>}
      >
        <Card.Meta 
          avatar={(
            <Link href={{ pathname: '/user', query: { id: post.User.id } }} as={`/user/${post.User.id}`}>
              <a><Avatar>{post.User.nickname[0]}</Avatar></a>
            </Link>)}
          title={post.User.nickname}
          description={(
            <div>
              {post.content.split(/(#[^\s]+)/g).map((v, i) => {
                if (v.match(/#[^\s]+/)) {
                  return (
                    <Link 
                      href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
                      as={`/hashtag/${v.slice(1)}`} 
                      key={+v.createdAt}
                    >
                      <a>{v}</a>
                    </Link>
                  );
                }
                return v; 
              })};
            </div>
          )}
        />
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>클릭</Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={ item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )} 
    </div>
  )
};

PostCard.prototypes = {
  post: PropTypes.shape({
    User : PropTypes.object,
    content : PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.object,  
  }),
}

export default PostCard;


```

#### \front\reducers\post.js
```js
export const initialState = {
  mainPosts: [],
  imagePaths: [],
  addPostErrorReason: '',
  isAddingPost: false,
  postAdded: false,
  isAddingComment: false,
  addCommentErrorReason: '',
  commentAdded: false,
};

...생략

export default (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_IMAGES_REQUEST: {
      return {
        ...state,
      };
    }
    case UPLOAD_IMAGES_SUCCESS: {
      return {
        ...state,
        imagePaths: [...state.imagePaths, ...action.data],
      };
    }
    case UPLOAD_IMAGES_FAILURE: {
      return {
        ...state,
      };
    }
    case REMOVE_IMAGE: {
      return {
        ...state,
        imagePaths: state.imagePaths.filter((v, i) => i !== action.index),
      }
    }
    case ADD_POST_REQUEST: {
      return {
        ...state,
        isAddingPost: true,
        addPostErrorReason: '',
        postAdded: false,
      };
    }
    case ADD_POST_SUCCESS: {
      return {
        ...state,
        isAddingPost: false,
        mainPosts: [action.data, ...state.mainPosts],
        postAdded: true,
        imagePaths: [],
      };
    }
    case ADD_POST_FAILURE: {
      return {
        ...state,
        isAddingPost: false,
        addPostErrorReason: action.error,
      };
    }
    case ADD_COMMENT_REQUEST: {
      return {
        ...state,
        isAddingComment: true,
        addCommentErrorReason: '',
        commentAdded: false,
      };
    }
    case ADD_COMMENT_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
      const post = state.mainPosts[postIndex];
      const Comments = [...post.Comments, action.data.comment];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        isAddingComment: false,
        mainPosts,
        commentAdded: true,
      };
    }
    case ADD_COMMENT_FAILURE: {
      return {
        ...state,
        isAddingComment: false,
        addCommentErrorReason: action.error,
      };
    }
    case LOAD_COMMENTS_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId
      );
      const post = state.mainPosts[postIndex];
      const Comments = action.data.comments;
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        mainPosts
      };
    }
    case LOAD_MAIN_POSTS_REQUEST:
    case LOAD_HASHTAG_POSTS_REQUEST:
    case LOAD_USER_POSTS_REQUEST: {
      return {
        ...state,
        mainPosts: [],
      };
    }
    case LOAD_MAIN_POSTS_SUCCESS:
    case LOAD_HASHTAG_POSTS_SUCCESS:
    case LOAD_USER_POSTS_SUCCESS: {
      return {
        ...state,
        mainPosts: action.data,
      };
    }
    case LOAD_MAIN_POSTS_FAILURE:yy
    case LOAD_HASHTAG_POSTS_FAILURE:yy
    case LOAD_USER_POSTS_FAILURE: {
      return {
        ...state,
      };
    }
    case LIKE_POST_REQUEST: {
      return {
        ...state,
      };
    }
    case LIKE_POST_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId
      );
      const post = state.mainPosts[postIndex];
      const Likers = [{ id: action.data.userId}, ...post.Likers]; 
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Likers };
      return {
        ...state,
        mainPosts,
      };
    }
    case LIKE_POST_FAILURE: {
      return {
        ...state,
      };
    }
    case UNLIKE_POST_REQUEST: {
      return {
        ...state,
      };
    }
    case UNLIKE_POST_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
      const post = state.mainPosts[postIndex];
      const Likers = post.Likers.filter(v => v.id !== action.data.userId);
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Likers };
      return {
        ...state,
        mainPosts,
      };
    }
    case UNLIKE_POST_FAILURE: {
      return {
        ...state,
      };
    }
    case RETWEET_REQUEST: {
      return {
        ...state,
      };
    }
    case RETWEET_SUCCESS: {
      return {
        ...state,
        // 기존의 게시글을 받아오기
        mainPosts: [action.data, ...state.mainPosts],
      };
    }
    case RETWEET_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

```

#### \front\sagas\post.js
```js
import axios from 'axios';
import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects';
import { 
  ADD_POST_REQUEST, ADD_POST_FAILURE, ADD_POST_SUCCESS, 
  ADD_COMMENT_SUCCESS, ADD_COMMENT_REQUEST, ADD_COMMENT_FAILURE, 
  LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE, LOAD_MAIN_POSTS_REQUEST, LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE, LOAD_USER_POSTS_REQUEST, LOAD_COMMENTS_FAILURE, LOAD_COMMENTS_REQUEST, LOAD_COMMENTS_SUCCESS, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE, UPLOAD_IMAGES_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE, LIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE, UNLIKE_POST_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE, RETWEET_REQUEST 
} from '../reducers/post';


function AddCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, { content: data.content }, {
    withCredentials: true,
  });
}
function* AddComment(action) { 
  try {
    const result = yield call(AddCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId, 
        comment: result.data,
      }
    })
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e
    })
  }
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, AddComment);
}

function loadCommentsAPI(postId) {
  return axios.get(`/post/${postId}/comments`);
}

function* loadComments(action) {
  try {
    const result = yield call(loadCommentsAPI, action.data);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        postId: action.data,
        comments: result.data
      }
    });
  } catch (e) {
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error: e
    });
  }
}

function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}


function addPostAPI(postData) {
  return axios.post('/post', postData, {
    withCredentials: true,
  });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}


function loadMainPostsAPI() {
  return axios.get('/posts');
}

function* loadMainPosts() {
  try {
    const result = yield call(loadMainPostsAPI);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}


function loadHashtagPostsAPI(tag) {
  return axios.get(`/hashtag/${tag}`);
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}


function loadUserPostsAPI(id) {
  return axios.get(`/user/${id}/posts`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function uploadImagesAPI(formData) {
  return axios.post(`/post/images`, formData ,{
    withCredentials: true,
  });
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: e,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function likePostAPI(postId) {
  return axios.post(`/post/${postId}/like`, {} ,{
    withCredentials: true,
  });
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId,
      }
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function unlikePostAPI(postId) {
  return axios.delete(`/post/${postId}/unlike`, {
    withCredentials: true,
  });
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: { 
        postId: action.data,
        userId: result.data.userId,
      }
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function retweetAPI(postId) {
  return axios.post(`/post/${postId}/retweet`,{} , {
    withCredentials: true,
  });
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: RETWEET_FAILURE,
      error: e,
    });
    alert(e.response && e.response.data );
  }
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadMainPosts),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchRetweet),
  ]);
}
```

## 리트윗 프론트 화면 만들기
[위로가기](#기능-완성해나가기)

#### \front\components\PostCard.js
```js
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from 'antd';
import Link from 'next/link'
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent'

const PostCard = ({post}) => {

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, [commentFormOpened]);
  
  const onSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!me) {
      return alert('로그인이 필요합니다.');
    };
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText,
      }
    })
    
  }, [me && me.id, commentText]);

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
  }, [commentAdded]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  const onToggleLike = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다!');
    }
    if (liked) {
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else {
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [me && me.id, post && post.id, liked]);

  const onRetweet = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [me && me.id, post && post.id]);

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.Images && post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <Icon type="retweet" key="retweet" onClick={onRetweet} />,
          <Icon
            type="heart"
            key="heart"
            theme={liked ? 'twoTone' : 'outlined'}
            twoToneColor="#eb2f96"
            onClick={onToggleLike}
          />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={<Button>팔로우</Button>}
      >
        {post.RetweetId && post.Retweet
          ? (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
              <Card.Meta
                avatar={(
                  <Link
                    href={{ pathname: '/user', query: { id: post.Retweet.User.id } }}
                    as={`/user/${post.Retweet.User.id}`}
                  >
                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                  </Link>
                )}
                title={post.Retweet.User.nickname}
                description={<PostCardContent postData={post.Retweet.content} />}
              />
            </Card>
          )
          : (
            <Card.Meta
              avatar={(
                <Link href={{ pathname: '/user', query: { id: post.User.id } }} as={`/user/${post.User.id}`}>
                  <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                </Link>
              )}
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />} 
            />
          )}
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>클릭</Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={ item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )} 
    </div>
  )
};

PostCard.prototypes = {
  post: PropTypes.shape({
    User : PropTypes.object,
    content : PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.object,  
  }),
}

export default PostCard;


```

#### \front\components\PostCardContent.js
```js
import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => {
  return (
    <div>
      {postData.split(/(#[^\s]+)/g).map((v) => {
        if (v.match(/#[^\s]+/)) {
          return (
            <Link
              href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
              as={`/hashtag/${v.slice(1)}`}
              key={v}
            >
              <a>{v}</a>
            </Link>
          );
        }
        return v;
      })}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
```


## 팔로우 언팔로우
[위로가기](#기능-완성해나가기)

#### \front\components\PostCard.js
```js
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from 'antd';
import Link from 'next/link'
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent'
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';

const PostCard = ({post}) => {

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, [commentFormOpened]);
  
  const onSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!me) {
      return alert('로그인이 필요합니다.');
    };
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText,
      }
    })
    
  }, [me && me.id, commentText]);

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
  }, [commentAdded]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  const onToggleLike = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다!');
    }
    if (liked) {
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else {
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [me && me.id, post && post.id, liked]);

  const onRetweet = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [me && me.id, post && post.id]);

  const onFollow = useCallback(userId => () => {
    dispatch({
      type: FOLLOW_USER_REQUEST,
      data: userId,
    });
  }, []);

  const onUnfollow = useCallback(userId => () => {
    dispatch({
      type: UNFOLLOW_USER_REQUEST,
      data: userId,
    });
  }, []);

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.Images && post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <Icon type="retweet" key="retweet" onClick={onRetweet} />,
          <Icon
            type="heart"
            key="heart"
            theme={liked ? 'twoTone' : 'outlined'}
            twoToneColor="#eb2f96"
            onClick={onToggleLike}
          />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={!me || post.User.id === me.id
          ? null
          : me.Followings && me.Followings.find(v => v.id === post.User.id)
            ? <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
            : <Button onClick={onFollow(post.User.id)}>팔로우</Button>
        }
      >
        {post.RetweetId && post.Retweet
          ? (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
              <Card.Meta
                avatar={(
                  <Link
                    href={{ pathname: '/user', query: { id: post.Retweet.User.id } }}
                    as={`/user/${post.Retweet.User.id}`}
                  >
                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                  </Link>
                )}
                title={post.Retweet.User.nickname}
                description={<PostCardContent postData={post.Retweet.content} />}
              />
            </Card>
          )
          : (
            <Card.Meta
              avatar={(
                <Link href={{ pathname: '/user', query: { id: post.User.id } }} as={`/user/${post.User.id}`}>
                  <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                </Link>
              )}
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />} 
            />
          )}
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>클릭</Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={ item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )} 
    </div>
  )
};

PostCard.prototypes = {
  post: PropTypes.shape({
    User : PropTypes.object,
    content : PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.object,  
  }),
}

export default PostCard;


```

#### \front\reducers\user.js
```js
...생략

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        isLoading : false,
        me: action.data,
      };
    }
    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        logInErrorReason : action.error,
        me: null,
      };
    }

    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggingOut: true,
      };
    }
    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        isLoggingOut: false,
        me: null
      };
    }
    case LOG_OUT_FAILURE: {
      return {
        ...state,
        isLoggingOut: false,
      };
    }

    case SIGN_UP_REQUEST: { 
      return { 
        ...state, 
        isSigningUp: true,
        isSignedUp: false,
        signUpErrorReason: '',
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_SUCCESS: { 
      return { 
        ...state, 
        isSigningUp: false,
        isSignedUp: true, 
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_FAILURE: { 
      return { 
        ...state, 
        isSigningUp : false,
        signUpErrorReason : action.error, 
        isSignUpSuccesFailure: true,
      }; 
    }
    
    case LOAD_USER_REQUEST: { 
      return { 
        ...state, 
      }; 
    }
    case LOAD_USER_SUCCESS: { 
      if (action.me) {
        return { 
          ...state, 
          me : action.data, 
        }; 
      }
      return {
        ...state,
        userInfo: action.data
      }
    }
    case LOAD_USER_FAILURE: { 
      return { 
        ...state, 
      }; 
    } 
     case FOLLOW_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case FOLLOW_USER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followings: [{ id: action.data }, ...state.me.Followings],
        },
      };
    }
    case FOLLOW_USER_FAILURE: {
      return {
        ...state,
      };
    }
    case UNFOLLOW_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case UNFOLLOW_USER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followings: state.me.Followings.filter(v => v.id !== action.data),
        },
      };
    }
    case UNFOLLOW_USER_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return {
        ...state,
      }
    }
  }
};
```

#### \front\sagas\user.js
```js
import axios from 'axios';
import { all, fork, takeLatest, call, put, takeEvery } from 'redux-saga/effects';
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST, FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST, UNFOLLOW_USER_FAILURE, UNFOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE, FOLLOW_USER_SUCCESS } from '../reducers/user'

function logInAPI(logInData) {
  return axios.post('/user/login', logInData, {
    withCredentials: true, 
  });
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data
    })
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    })
  }
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function signUpAPI(signUpdata) {
  return axios.post('/user/', signUpdata);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data); 
    yield put({
      type: SIGN_UP_SUCCESS
    });
  } catch (err) {
    console.error(err)
    yield put({ 
      type : SIGN_UP_FAILURE,
      error : err.response.data,
    });
  }
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}


function logOutAPI() {
  return axios.post('/user/logout', {}, { 
    withCredentials: true, 
  }); 
  
}

function* logOut() {
  try {
    yield call(logOutAPI); 
    yield put({
      type: LOG_OUT_SUCCESS
    });
  } catch (err) {
    console.error(err);
    yield put({ 
      type : LOG_OUT_FAILURE,
      error : err,
    });
  }
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}



function loadUserAPI(userId) {
  return axios.get( userId ? `/user/${userId}` : `/user/`, {
    withCredentials: true,
  });
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}


function followAPI(userId) {
  return axios.post(`/user/${userId}/follow`, {}, {
    withCredentials: true,
  });
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: FOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchFollow() {
  yield takeEvery(FOLLOW_USER_REQUEST, follow);
}

function unfollowAPI(userId) {
  return axios.delete(`/user/${userId}/unfollow`, {
    withCredentials: true,
  })
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchUnfollow() {
  yield takeEvery(UNFOLLOW_USER_REQUEST, unfollow);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut), 
    fork(watchLoadUser), 
    fork(watchSignUp),
    fork(watchFollow), 
    fork(watchUnfollow),
  ]);
}
```

## 다른 리듀서 데이터 조작하기
[위로가기](#기능-완성해나가기)

#### \front\reducers\user.js
```js
...생략

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        isLoading : false,
        me: action.data,
      };
    }
    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        logInErrorReason : action.error,
        me: null,
      };
    }

    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggingOut: true,
      };
    }
    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        isLoggingOut: false,
        me: null
      };
    }
    case LOG_OUT_FAILURE: {
      return {
        ...state,
        isLoggingOut: false,
      };
    }

    case SIGN_UP_REQUEST: { 
      return { 
        ...state, 
        isSigningUp: true,
        isSignedUp: false,
        signUpErrorReason: '',
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_SUCCESS: { 
      return { 
        ...state, 
        isSigningUp: false,
        isSignedUp: true, 
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_FAILURE: { 
      return { 
        ...state, 
        isSigningUp : false,
        signUpErrorReason : action.error, 
        isSignUpSuccesFailure: true,
      }; 
    }
    
    case LOAD_USER_REQUEST: { 
      return { 
        ...state, 
      }; 
    }
    case LOAD_USER_SUCCESS: { 
      if (action.me) {
        return { 
          ...state, 
          me : action.data, 
        }; 
      }
      return {
        ...state,
        userInfo: action.data
      }
    }
    case LOAD_USER_FAILURE: { 
      return { 
        ...state, 
      }; 
    } 
     case FOLLOW_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case FOLLOW_USER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followings: [{ id: action.data }, ...state.me.Followings],
        },
      };
    }
    case FOLLOW_USER_FAILURE: {
      return {
        ...state,
      };
    }
    case UNFOLLOW_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case UNFOLLOW_USER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followings: state.me.Followings.filter(v => v.id !== action.data),
        },
      };
    }
    case UNFOLLOW_USER_FAILURE: {
      return {
        ...state,
      };
    }
    case ADD_POST_TO_ME: {
      return {
        ...state,
        me : {
          ...state.me,
          Posts: [{ id: action.data}, ...state.me.Posts],
        },
      };
    }
    default: {
      return {
        ...state,
      }
    }
  }
};
```

#### \front\sagas\post.js
```js
import axios from 'axios';
import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects';
import { 
  ADD_POST_REQUEST, ADD_POST_FAILURE, ADD_POST_SUCCESS, 
  ADD_COMMENT_SUCCESS, ADD_COMMENT_REQUEST, ADD_COMMENT_FAILURE, 
  LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE, LOAD_MAIN_POSTS_REQUEST, LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE, LOAD_USER_POSTS_REQUEST, LOAD_COMMENTS_FAILURE, LOAD_COMMENTS_REQUEST, LOAD_COMMENTS_SUCCESS, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE, UPLOAD_IMAGES_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE, LIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE, UNLIKE_POST_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE, RETWEET_REQUEST 
} from '../reducers/post';
import { ADD_POST_TO_ME } from '../reducers/user'

function AddCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, { content: data.content }, {
    withCredentials: true,
  });
}
function* AddComment(action) { 
  try {
    const result = yield call(AddCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId, 
        comment: result.data,
      }
    })
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e
    })
  }
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, AddComment);
}

function loadCommentsAPI(postId) {
  return axios.get(`/post/${postId}/comments`);
}

function* loadComments(action) {
  try {
    const result = yield call(loadCommentsAPI, action.data);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        postId: action.data,
        comments: result.data
      }
    });
  } catch (e) {
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error: e
    });
  }
}

function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}


function addPostAPI(postData) {
  return axios.post('/post', postData, {
    withCredentials: true,
  });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id
    })
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}


function loadMainPostsAPI() {
  return axios.get('/posts');
}

function* loadMainPosts() {
  try {
    const result = yield call(loadMainPostsAPI);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}


function loadHashtagPostsAPI(tag) {
  return axios.get(`/hashtag/${tag}`);
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}


function loadUserPostsAPI(id) {
  return axios.get(`/user/${id}/posts`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function uploadImagesAPI(formData) {
  return axios.post(`/post/images`, formData ,{
    withCredentials: true,
  });
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: e,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function likePostAPI(postId) {
  return axios.post(`/post/${postId}/like`, {} ,{
    withCredentials: true,
  });
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId,
      }
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function unlikePostAPI(postId) {
  return axios.delete(`/post/${postId}/unlike`, {
    withCredentials: true,
  });
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: { 
        postId: action.data,
        userId: result.data.userId,
      }
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function retweetAPI(postId) {
  return axios.post(`/post/${postId}/retweet`,{} , {
    withCredentials: true,
  });
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: RETWEET_FAILURE,
      error: e,
    });
    alert(e.response && e.response.data );
  }
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadMainPosts),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchRetweet),
  ]);
}
```
## 프로필 및 데이터 로딩하기
[위로가기](#기능-완성해나가기)

#### \front\pages\profile.js
```js
import React, { useEffect, useCallback } from 'react';
import {Form, Input, Button, List, Card, Icon} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import NickNameEditForm from '../components/NickNameEditForm';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, UNFOLLOW_USER_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

const Profile = () => {
  const dispatch = useDispatch();
  const { me, followingList, followerList } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);

  useEffect(() => {
    if (me) {
      dispatch({
        type: LOAD_FOLLOWERS_REQUEST,
        data: me.id,
      });
      dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
        data: me.id,
      });
      dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: me.id,
      });
    }
  }, [me && me.id]);

  const onUnfollow = useCallback(userId => () => {
    dispatch({
      type: UNFOLLOW_USER_REQUEST,
      data: userId,
    });
  }, []);

  const onRemoveFollower = useCallback(userId => () => {
    dispatch({
      type: REMOVE_FOLLOWER_REQUEST,
      data: userId,
    });
  }, []);

  return (
    <div>
      <NickNameEditForm />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>팔로잉 목록</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        bordered
        dataSource={followingList}
        renderItem={item => (
          <List.Item style={{ marginTop: '20px' }}>
            <Card actions={[<Icon key="stop" type="stop" onClick={onUnfollow(item.id)} />]}>
              <Card.Meta description={item.nickname} />
            </Card>
          </List.Item>
        )}
      />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>팔로워 목록</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        bordered
        dataSource={followerList}
        renderItem={item => (
          <List.Item style={{ marginTop: '20px' }}>
            <Card actions={[<Icon key="stop" type="stop" onClick={onRemoveFollower(item.id)} />]}>
              <Card.Meta description={item.nickname} />
            </Card>
          </List.Item>
        )}
      />
      <div>
        {mainPosts.map(c => (
          <PostCard key={+c.createdAt} post={c} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
```

#### \front\reducers\user.js
```js

export const initialState = {
  isLoggingOut : false,
  isLoggingIn : false,
  logInErrorReason: '',
  isSigningUp: false,
  isSignedUp : false,
  signUpErrorReason: '',
  isSignUpSuccesFailure: false,
  me: null,
  followingList : [],
  followerList: [],
  userInfo: null,
};

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

export const REMOVE_USER_REQUEST = 'REMOVE_USER_REQUEST';
export const REMOVE_USER_SUCCESS = 'REMOVE_USER_SUCCESS';
export const REMOVE_USER_FAILURE = 'REMOVE_USER_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        isLoading : false,
        me: action.data,
      };
    }
    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        logInErrorReason : action.error,
        me: null,
      };
    }

    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggingOut: true,
      };
    }
    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        isLoggingOut: false,
        me: null
      };
    }
    case LOG_OUT_FAILURE: {
      return {
        ...state,
        isLoggingOut: false,
      };
    }

    case SIGN_UP_REQUEST: { 
      return { 
        ...state, 
        isSigningUp: true,
        isSignedUp: false,
        signUpErrorReason: '',
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_SUCCESS: { 
      return { 
        ...state, 
        isSigningUp: false,
        isSignedUp: true, 
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_FAILURE: { 
      return { 
        ...state, 
        isSigningUp : false,
        signUpErrorReason : action.error, 
        isSignUpSuccesFailure: true,
      }; 
    }
    
    case LOAD_USER_REQUEST: { 
      return { 
        ...state, 
      }; 
    }
    case LOAD_USER_SUCCESS: { 
      if (action.me) {
        return { 
          ...state, 
          me : action.data, 
        }; 
      }
      return {
        ...state,
        userInfo: action.data
      }
    }
    case LOAD_USER_FAILURE: { 
      return { 
        ...state, 
      }; 
    } 
     case FOLLOW_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case FOLLOW_USER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followings: [{ id: action.data }, ...state.me.Followings],
        },
      };
    }
    case FOLLOW_USER_FAILURE: {
      return {
        ...state,
      };
    }
    case UNFOLLOW_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case UNFOLLOW_USER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followings: state.me.Followings.filter(v => v.id !== action.data),
        },
        followingList: state.followingList.filter(v => v.id !== action.data),
      };
    }
    case UNFOLLOW_USER_FAILURE: {
      return {
        ...state,
      };
    }
    case ADD_POST_TO_ME: {
      return {
        ...state,
        me : {
          ...state.me,
          Posts: [{ id: action.data}, ...state.me.Posts],
        },
      };
    }
    case LOAD_FOLLOWERS_REQUEST: {
      return {
        ...state,
      };
    }
    case LOAD_FOLLOWERS_SUCCESS: {
      return {
        ...state,
        followerList: action.data,
      };
    }
    case LOAD_FOLLOWERS_FAILURE: {
      return {
        ...state,
      };
    }
    case LOAD_FOLLOWINGS_REQUEST: {
      return {
        ...state,
      };
    }
    case LOAD_FOLLOWINGS_SUCCESS: {
      return {
        ...state,
        followingList: action.data,
      };
    }
    case LOAD_FOLLOWINGS_FAILURE: {
      return {
        ...state,
      };
    }
    case REMOVE_FOLLOWER_REQUEST: {
      return {
        ...state,
      };
    }
    case REMOVE_FOLLOWER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followers: state.me.Followers.filter(v => v.id !== action.data),
        },
        followerList: state.followerList.filter(v => v.id !== action.data),
      };
    }
    case REMOVE_FOLLOWER_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return {
        ...state,
      }
    }
  }
};
```

#### \front\sagas\user.js
```js
import axios from 'axios';
import { all, fork, takeLatest, call, put, takeEvery } from 'redux-saga/effects';
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST, FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST, UNFOLLOW_USER_FAILURE, UNFOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE, FOLLOW_USER_SUCCESS, LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWERS_FAILURE, LOAD_FOLLOWINGS_FAILURE, LOAD_FOLLOWINGS_REQUEST, REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_FAILURE, REMOVE_FOLLOWER_SUCCESS, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWINGS_SUCCESS } from '../reducers/user'

function logInAPI(logInData) {
  return axios.post('/user/login', logInData, {
    withCredentials: true, 
  });
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data
    })
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    })
  }
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function signUpAPI(signUpdata) {
  return axios.post('/user/', signUpdata);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data); 
    yield put({
      type: SIGN_UP_SUCCESS
    });
  } catch (err) {
    console.error(err)
    yield put({ 
      type : SIGN_UP_FAILURE,
      error : err.response.data,
    });
  }
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}


function logOutAPI() {
  return axios.post('/user/logout', {}, { 
    withCredentials: true, 
  }); 
  
}

function* logOut() {
  try {
    yield call(logOutAPI); 
    yield put({
      type: LOG_OUT_SUCCESS
    });
  } catch (err) {
    console.error(err);
    yield put({ 
      type : LOG_OUT_FAILURE,
      error : err,
    });
  }
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}



function loadUserAPI(userId) {
  return axios.get( userId ? `/user/${userId}` : `/user/`, {
    withCredentials: true,
  });
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}


function followAPI(userId) {
  return axios.post(`/user/${userId}/follow`, {}, {
    withCredentials: true,
  });
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: FOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchFollow() {
  yield takeEvery(FOLLOW_USER_REQUEST, follow);
}

function unfollowAPI(userId) {
  return axios.delete(`/user/${userId}/unfollow`, {
    withCredentials: true,
  })
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchUnfollow() {
  yield takeEvery(UNFOLLOW_USER_REQUEST, unfollow);
}

function loadFollowersAPI(userId) {
  return axios.get(`/user/${userId}/followers`, {
    withCredentials: true,
  })
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadFollowers() {
  yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function loadFollowingsAPI(userId) {
  return axios.get(`/user/${userId}/followings`, {
    withCredentials: true,
  })
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function removeFollowerAPI(userId) {
  return axios.delete(`/user/${userId}/follower`, {
    withCredentials: true,
  })
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: e,
    });
  }
}

function* watchRemoveFollower() {
  yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}


export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut), 
    fork(watchLoadUser), 
    fork(watchSignUp),
    fork(watchFollow), 
    fork(watchUnfollow),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
  ]);
}
```

## 닉네임 수정하기
[위로가기](#기능-완성해나가기)

#### \front\components\NickNameEditForm.js
```js
import React, { useState, useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { EDIT_NICKNAME_REQUEST } from '../reducers/user';

const NickNameEditForm = () => {
  const [editedName, setEditedName] = useState('');
  const dispatch = useDispatch();
  const { me, isEditingNickname } = useSelector(state => state.user);

  const onChangeNickname = useCallback((e) => {
    setEditedName(e.target.value);
  }, []);

  const onEditNickname = useCallback((e) => {
    e.preventDefault();
    dispatch({
      type: EDIT_NICKNAME_REQUEST,
      data: editedName,
    })
  }, [editedName]);

  return (
    <Form style={{ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px' }} onSubmit={onEditNickname}>
      <Input addonBefore="닉네임" value={editedName || (me && me.nickname) } onChange={onChangeNickname} />
      <Button type="primary" htmlType="submit" loading={isEditingNickname} >수정</Button>
    </Form>
  )
}

export default NickNameEditForm;
```

#### \front\reducers\user.js
```js

export const initialState = {
  isLoggingOut : false,
  isLoggingIn : false,
  logInErrorReason: '',
  isSigningUp: false,
  isSignedUp : false,
  signUpErrorReason: '',
  isSignUpSuccesFailure: false,
  me: null,
  followingList : [],
  followerList: [],
  userInfo: null,
  isEditingNickname: false,
  editNicknameErrorResason: '',
};

...생략

export const EDIT_NICKNAME_REQUEST = 'EDIT_NICKNAME_REQUEST';
export const EDIT_NICKNAME_SUCCESS = 'EDIT_NICKNAME_SUCCESS';
export const EDIT_NICKNAME_FAILURE = 'EDIT_NICKNAME_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        isLoading : false,
        me: action.data,
      };
    }
    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        logInErrorReason : action.error,
        me: null,
      };
    }

    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggingOut: true,
      };
    }
    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        isLoggingOut: false,
        me: null
      };
    }
    case LOG_OUT_FAILURE: {
      return {
        ...state,
        isLoggingOut: false,
      };
    }

    case SIGN_UP_REQUEST: { 
      return { 
        ...state, 
        isSigningUp: true,
        isSignedUp: false,
        signUpErrorReason: '',
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_SUCCESS: { 
      return { 
        ...state, 
        isSigningUp: false,
        isSignedUp: true, 
        isSignUpSuccesFailure: false,
      }; 
    }
    case SIGN_UP_FAILURE: { 
      return { 
        ...state, 
        isSigningUp : false,
        signUpErrorReason : action.error, 
        isSignUpSuccesFailure: true,
      }; 
    }
    
    case LOAD_USER_REQUEST: { 
      return { 
        ...state, 
      }; 
    }
    case LOAD_USER_SUCCESS: { 
      if (action.me) {
        return { 
          ...state, 
          me : action.data, 
        }; 
      }
      return {
        ...state,
        userInfo: action.data
      }
    }
    case LOAD_USER_FAILURE: { 
      return { 
        ...state, 
      }; 
    } 
     case FOLLOW_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case FOLLOW_USER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followings: [{ id: action.data }, ...state.me.Followings],
        },
      };
    }
    case FOLLOW_USER_FAILURE: {
      return {
        ...state,
      };
    }
    case UNFOLLOW_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case UNFOLLOW_USER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followings: state.me.Followings.filter(v => v.id !== action.data),
        },
        followingList: state.followingList.filter(v => v.id !== action.data),
      };
    }
    case UNFOLLOW_USER_FAILURE: {
      return {
        ...state,
      };
    }
    case ADD_POST_TO_ME: {
      return {
        ...state,
        me : {
          ...state.me,
          Posts: [{ id: action.data}, ...state.me.Posts],
        },
      };
    }
    case LOAD_FOLLOWERS_REQUEST: {
      return {
        ...state,
      };
    }
    case LOAD_FOLLOWERS_SUCCESS: {
      return {
        ...state,
        followerList: action.data,
      };
    }
    case LOAD_FOLLOWERS_FAILURE: {
      return {
        ...state,
      };
    }
    case LOAD_FOLLOWINGS_REQUEST: {
      return {
        ...state,
      };
    }
    case LOAD_FOLLOWINGS_SUCCESS: {
      return {
        ...state,
        followingList: action.data,
      };
    }
    case LOAD_FOLLOWINGS_FAILURE: {
      return {
        ...state,
      };
    }
    case REMOVE_FOLLOWER_REQUEST: {
      return {
        ...state,
      };
    }
    case REMOVE_FOLLOWER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followers: state.me.Followers.filter(v => v.id !== action.data),
        },
        followerList: state.followerList.filter(v => v.id !== action.data),
      };
    }
    case REMOVE_FOLLOWER_FAILURE: {
      return {
        ...state,
      };
    }
    case EDIT_NICKNAME_REQUEST: {
      return {
        ...state,
        isEditingNickname: true, // 로딩 창
        editNicknameErrorResason: '',
      };
    }
    case EDIT_NICKNAME_SUCCESS: {
      return {
        ...state,
        isEditingNickname: false,
        me: {
          ...state.me,
          nickname: action.data,
        },
      };
    }
    case EDIT_NICKNAME_FAILURE: {
      return {
        ...state,
        isEditingNickname: false,
        editNicknameErrorResason: action.error,
      };
    }
    default: {
      return {
        ...state,
      }
    }
  }
};
```

#### \front\sagas\user.js
```js
import axios from 'axios';
import { all, fork, takeLatest, call, put, takeEvery } from 'redux-saga/effects';
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST, FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST, UNFOLLOW_USER_FAILURE, UNFOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE, FOLLOW_USER_SUCCESS, LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWERS_FAILURE, LOAD_FOLLOWINGS_FAILURE, LOAD_FOLLOWINGS_REQUEST, REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_FAILURE, REMOVE_FOLLOWER_SUCCESS, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWINGS_SUCCESS, EDIT_NICKNAME_SUCCESS, EDIT_NICKNAME_FAILURE, EDIT_NICKNAME_REQUEST } from '../reducers/user'

function logInAPI(logInData) {
  return axios.post('/user/login', logInData, {
    withCredentials: true, 
  });
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data
    })
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    })
  }
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function signUpAPI(signUpdata) {
  return axios.post('/user/', signUpdata);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data); 
    yield put({
      type: SIGN_UP_SUCCESS
    });
  } catch (err) {
    console.error(err)
    yield put({ 
      type : SIGN_UP_FAILURE,
      error : err.response.data,
    });
  }
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}


function logOutAPI() {
  return axios.post('/user/logout', {}, { 
    withCredentials: true, 
  }); 
  
}

function* logOut() {
  try {
    yield call(logOutAPI); 
    yield put({
      type: LOG_OUT_SUCCESS
    });
  } catch (err) {
    console.error(err);
    yield put({ 
      type : LOG_OUT_FAILURE,
      error : err,
    });
  }
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}



function loadUserAPI(userId) {
  return axios.get( userId ? `/user/${userId}` : `/user/`, {
    withCredentials: true,
  });
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}


function followAPI(userId) {
  return axios.post(`/user/${userId}/follow`, {}, {
    withCredentials: true,
  });
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: FOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchFollow() {
  yield takeEvery(FOLLOW_USER_REQUEST, follow);
}

function unfollowAPI(userId) {
  return axios.delete(`/user/${userId}/unfollow`, {
    withCredentials: true,
  })
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchUnfollow() {
  yield takeEvery(UNFOLLOW_USER_REQUEST, unfollow);
}

function loadFollowersAPI(userId) {
  return axios.get(`/user/${userId}/followers`, {
    withCredentials: true,
  })
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadFollowers() {
  yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function loadFollowingsAPI(userId) {
  return axios.get(`/user/${userId}/followings`, {
    withCredentials: true,
  })
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function removeFollowerAPI(userId) {
  return axios.delete(`/user/${userId}/follower`, {
    withCredentials: true,
  })
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: e,
    });
  }
}

function* watchRemoveFollower() {
  yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function editNicknameAPI(nickname) {
  return axios.patch(`/user/nickname`, {nickname}, {
    withCredentials: true,
  })
}

function* editNickname(action) {
  try {
    const result = yield call(editNicknameAPI, action.data);
    yield put({
      type: EDIT_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: EDIT_NICKNAME_FAILURE,
      error: e,
    });
  }
}

function* watchEditNickname() {
  yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut), 
    fork(watchLoadUser), 
    fork(watchSignUp),
    fork(watchFollow), 
    fork(watchUnfollow),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
    fork(watchEditNickname),
  ]);
}
```

