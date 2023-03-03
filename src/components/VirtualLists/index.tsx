import React, { useMemo, useState } from "react";
import styles from './index.module.scss'

// 模拟一万数据
const initData: any[] = []
for(let i = 1; i <= 10000; i++) {
  initData.push(i)
}

interface PropsType {
  listData?: any[];
  itemSize?: number;
}

export default function VirtualList(props: PropsType) {

  const { listData = initData, itemSize = 50} = props
  
  // 获取容器的高度
  const [start, setStart] = useState(0)
  const [startOffset, setStartOffset] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  const listHieght = useMemo(()=> listData.length * itemSize, [listData, itemSize])
  const visableCount = useMemo(() => Math.floor(containerHeight / itemSize), [containerHeight, itemSize])
  const end = useMemo(() => start + visableCount, [start, visableCount])
  const visiableData = useMemo(() => listData.slice(start, end), [listData, start, end])
  const getTransform = useMemo(() => `translate3d(0,${startOffset}px,0)`, [startOffset])

  const scrollEvent = (event: any) => {
    const { scrollTop } = event.target
    
    setStart(Math.floor(scrollTop / itemSize))
    setStartOffset(Math.floor(scrollTop - (scrollTop % itemSize)))
  }

  return (
    <div ref={(el)=> {
      if(el){
        setContainerHeight(el.offsetHeight)
      }
    }} className={styles.virtualList} onScroll={(e) => scrollEvent(e)}>
      {/* 为了呈现滚动条 */}
      <div style={{height: listHieght}} className={styles.ableScroll} />
      {/* 渲染列表 */}
      <div style={{transform: getTransform}}>
        {
          visiableData.map((item, index) => (
            <div key={index} style={{height: itemSize, lineHeight: `${itemSize}px`}}>{item} --- 列</div>
          ))
        }
      </div>
    </div>
  )
}