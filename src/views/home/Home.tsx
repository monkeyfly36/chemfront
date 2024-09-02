import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, message, } from 'antd';
import styles from './Home.module.scss';
import intl from 'react-intl-universal';
import ChemLogo from 'Src/assets/image/chemLogo.png';
import { ReactComponent as Expand } from 'Src/assets/svg/expand.svg';
import { ReactComponent as NewChat } from 'Src/assets/svg/newChat.svg';
import { ReactComponent as Tip } from 'Src/assets/svg/tip.svg';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import { Select } from 'antd';
import { IO_getRoleLLM, IO_postLLM } from 'Src/api/home.js';
import classnames from 'classnames';

const { TextArea } = Input

function Home() {
  const [content, setContent] = useState('')
  const [recommends, setRecommends] = useState([])
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(undefined)
  const [answers, setAnswers] = useState([])
  const [leftHidden, setLeftHidden] = useState(true)

  const [isChating, setIsChating] = useState(false)
  const [isResLoading, setIsResLoading] = useState(false)

  const flag = useRef<boolean>(true) // 解决useEffect调用两次的问题
  useEffect(() => {
    if (flag.current) {
      flag.current = false;
      return;
    }
    init()
  }, [])

  const init = async () => {
    setRecommends([
      {
        title: ['Help me study', 'vocabulary for a college entrance exam'],
        content: `Help me study vocabulary: write a sentence for me to fill in the blank, and I'll try to pick the correct option.`
      },
      {
        title: ['Help me study1', `of a website's sticky header`],
        content: `Help me study1 vocabulary: write a sentence for me to fill in the blank, and I'll try to pick the correct option.`
      }
    ])
    try {
      const res = await IO_getRoleLLM()
      let data = res.data.data
      if (data.length) {
        data = data.map((item: object) => {
          item.label = item.id
          item.value = item.id
          return item
        })
        setModels(data)
      }
    } catch (e) {
      console.log('e', e)
    }
  }

  const getNewChat = () => {
    setIsChating(false)
    setIsResLoading(false)
    setAnswers(() => [])
    setContent('')
  }

  const addRecommend = (item: object) => {
    setContent(item.content)
  }

  const changeContent = (e: object) => {
    setContent(e.target.value)
  }

  const send = async () => {
    if (isResLoading) { 
      message.error('请等待上一个问题回答完成!')
      return
    }
    if (!selectedModel) {
      message.error('请确认选择一种模型!')
      return
    }

    if (!content) {
      message.error('请输入消息内容!')
      return
    }

    setIsChating(true)
    setIsResLoading(true)

    const loadingList = [content, '']
    setAnswers(pre => [...answers, loadingList])

    // const content = '请问甲烷的分子式，包含几个C，几个H'
    // const content = '请问二氧化钛锐钛矿哪个晶面的活性最高，并给你的参考的文献是哪一篇'
    // const data = '为了准确回答这个问题，需要了解二氧化钛的不同晶面类型。二氧化钛有多种晶型，包括金红石型、锐钛矿型和板钛矿型等。每种晶型都有其独特的晶面结构。因此，查询应涵盖这些晶型的基本信息和晶面结构。每种晶型都有其独特的晶面结构。因此，查询应涵盖这些晶型的基本信息和晶面结构。'
    // const list = [content, data]

    // console.log(111, answers)
    // setAnswers(pre => [...answers, list])

    const res = await IO_postLLM({
      "messages": [
        {
          "role": 'user',
          "content": content
        }
      ],
      "model": selectedModel,
    })


      // 'model': '/mnt/hwfile/ai4chem/CKPT/ChemLLM-20B-Chat-DPO',
      // "loc": 'body',
      // "msg": '请问二氧化钛哪个晶面的活性最高，并给你的参考的文献是哪一篇',
      // "type": 'promt',

      // messages: [{ role: 'user', content: 'Say this is a test' }],

      // no
      // chat_id: 'e14e4c4b-f469-433a-8af1-b8511edbb4cd',
      // id: "f346628b-ee13-4f57-9388-6a2debfeec00",
      // messages: [{ role: 'user', content: '请问二氧化钛哪个晶面的活性最高' }],
      // model: "qewn2:0.5b",
      // options: {},
      // session_id: "ZtXXK8koSJz8_Ix5AAAB",
      // stream: false,

      // ollama
      // "stream": false,
      // "model": "qwen2:0.5b",
      // "messages": [{ "role": "user", "content": content }],
      // "options": {},
      // "session_id": "ZPHg6if7JS-R95UMAAAF",
      // "chat_id": "14896a44-279e-4375-8d35-0bd2ca51024e",
      // "id": "23b2b483-584b-4672-a67e-d6199cdfb777"
   

    console.log('res------------->', res)
    const data = res.data.choices[0].message.content
    const list = [content, data]
    answers.splice(answers.length, 1)
    setAnswers(pre => [...answers, list])
    setContent('')
    setIsResLoading(false)
    
    // setTimeout(() => {
    //   const data = "甲苯的结构如下所示，其中苯环上有三个碳原子与甲基（-CH3）相连。\n\n$$\n\\text{C_6H_5-CH_3}\n$$\n\n在结构图中，苯环表示为六边形，其中的六个碳原子（C）用大的灰色圆表示。甲基被表示为较小的灰色圆，代表碳原子（C），与苯环上的碳原子相连。甲基内的三个氢原子（H）用小的白色圆表示。\n\n甲苯的分子式为C7H8，意味着它含有7个碳原子和8个氢原子。"
  
    //   const list = [content, data]
    //   answers.splice(answers.length, 1)
    //   setAnswers(pre => [...answers, list])
    //   setContent('')
    //   setIsResLoading(false)
    // }, 3000)
  }

  const onSend = (e: any) => {
    if (e.key === 'Enter') {
      send()
    }
  }

  const onChangeModel = (e: string) => {
    console.log(e)
    setSelectedModel(e)
  }
  const setLeftShow = () => {
    setLeftHidden(!leftHidden)
  }

  const onSearchModel = () => {

  }
    
  return (
    <div className={styles.container}>
      <div className={classnames({
        [styles.leftContainer]: true,
        [styles.showLeft]: leftHidden
      })}>
        <header>
          <div className={styles.newChat}>
            <div className={styles.textBox} onClick={getNewChat}>
              <img src={ChemLogo} width={24} height={24} alt="" />
              <span className={styles.text}>新对话</span>
            </div>
            <NewChat className={styles.icon} />
          </div>

          <div className={styles.expand} onClick={setLeftShow}>
            <Expand className={styles.icon} />
          </div>
        </header>
      </div>

      <div className={styles.rightContainer}>
        <div className={classnames({
          [styles.expand]: true,
          [styles.showLeft]: !leftHidden
        })} onClick={setLeftShow}>
          <Expand className={styles.icon} />
        </div>

        <div className={styles.container}>
          <header className={styles.header}>
            <Select
              showSearch
              allowClear
              className={styles.selectModel}
              placeholder="请选择一个模型"
              optionFilterProp="label"
              onChange={onChangeModel}
              onSearch={onSearchModel}
              value={selectedModel}
              options={models}
            />
          </header>

          <main>
            {
              answers.length === 0 ? (
                <section className={styles.mainCover}>
                  <div className={styles.contentCover}>
                    <img src={ChemLogo} width={46} height={46} alt="" />
                    <h3 className={styles.title}>您好</h3>
                    <h3 className={styles.subTitle}>有什么我能帮您的吗?</h3>
                    <h5 className={styles.recommend}>建议</h5>
                    <div className={styles.recommendWrap}>
                      {
                        recommends.map((item, index) => (
                          <div key={index} className={styles.itemWrap} onClick={() => addRecommend(item)}>
                            <div className={styles.text}>
                              <h3>{item && item.title[0]}</h3>
                              <h5>{item && item.title[1]}</h5>
                            </div>
                            <div className={styles.tipBox}>
                              <span className={styles.tip}>提示词</span>
                              <Tip width={16} height={16} />
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </section>
              ) : (
                <section className={styles.mainContent}>
                  <div className={styles.content}>
                    {
                      answers.map((item: object, key: number) => (
                        <div key={key}>
                          <div className={styles.request}>
                            <span>{item[0]}</span>
                          </div>
                          <div className={styles.answer}>
                            {/* <span>{item[1]}</span> */}
                            {
                              item[1] ? (
                                <MarkdownComponent markdown={item[1]} />
                              ): (
                                <div className={styles.loadingBox}>
                                  <div className={styles.dot1}></div>
                                  <div className={styles.dot2}></div>
                                  <div className={styles.dot3}></div>
                                </div>
                              )
                            }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </section>
              )
            }
          </main>

          <footer>
            <Input
              className={styles.input}
              placeholder='输入消息'
              onChange={changeContent}
              value={content}
              onKeyDown={onSend}
            />
            <Button className={styles.btn} onClick={send}>发送</Button>
          </footer>
        </div>
      </div>
    </div>
  );
}

const MarkdownComponent = ({ markdown }) => (
  <ReactMarkdown
    // remarkPlugins={[remarkGfm]}
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex]}
    children={markdown}
  />
  
);

export default Home;
