import React, { useEffect, useMemo, useState, useRef } from "react";
import styles from './index.module.scss'
import { faker } from '@faker-js/faker';

// 模拟一万数据
const initData: any[] = []
for(let i = 1; i <= 10000; i++) {
  initData.push(`${i} -- ${faker.lorem.sentences()}`)
}

interface PropsType {
  listData?: any[];
  estimatedItemSize?: number; // 预估的高度
}

export default function VirtualListsDynamic(props: PropsType) {

  const itemsRef = useRef<HTMLDivElement>(null)

  const { listData = initData, estimatedItemSize = 100} = props
  
  const [start, setStart] = useState(0)
  const [startOffset, setStartOffset] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [positions, setPositions] = useState(listData.map((item, index) => {
    return {
      index,
      height: estimatedItemSize,
      top: index * estimatedItemSize,
      bottom: (index + 1) * estimatedItemSize
    }
  }))

  const listHieght = useMemo(()=> positions[positions.length - 1].bottom, [positions])
  const visableCount = useMemo(() => Math.ceil(containerHeight / estimatedItemSize), [containerHeight, estimatedItemSize])
  const end = useMemo(() => start + visableCount, [start, visableCount])
  const visiableData = useMemo(() => listData.slice(start, end), [listData, start, end])
  const getTransform = useMemo(() => `translate3d(0,${startOffset}px,0)`, [startOffset])

  // 渲染后，计算当前元素(item)的真实高度
  useEffect(() => { 
    if(itemsRef.current) {
      const nodes = itemsRef.current.childNodes
      nodes.forEach((item: any, index) => {
        const rect = item.getBoundingClientRect()

        setPositions((pre) => {
          const height = rect.height 
          const oldHeight = pre[index].height          
          const dValue = oldHeight - height

          if(dValue) {
            pre[index].bottom = pre[index].bottom - dValue
            pre[index].height = height

            for(let i = index + 1; i < positions.length; i++) {
              pre[i].top = pre[i - 1].bottom
              pre[i].bottom = pre[i].bottom - dValue
            }
          }
          return pre
        })
        
      })
    }
  })
  
  const scrollEvent = (event: any) => {
    const { scrollTop } = event.target
    setStart(pre => {
      const value = binarySearch(positions, scrollTop)
      if(value >= 1) {
        setStartOffset(positions[value - 1].bottom)      
      } else {
        setStartOffset(0)
      }
      return value
    })
  }

  // 二分查找
  const binarySearch = (list: any[], value: number) => {
    let left = 0;
    let right = list.length - 1
    let tempIndex = null;

    while(left <= right) {
      let midIndex = Math.floor((left + right) / 2)
      let midValue = positions[midIndex].bottom
      if(midValue === value) {
        return midIndex + 1
      } else if(midValue < value) {
        left = midIndex + 1
      } else if(midValue > value) {
        if(tempIndex === null || tempIndex > midIndex){
          tempIndex = midIndex 
        }
        right = midIndex - 1
      }
    }
    return tempIndex!
  }

  return (
    <div ref={(el)=> {
      if(el){
        setContainerHeight(el.offsetHeight)
      }
    }} className={styles.VirtualListsDynamic} onScroll={(e) => scrollEvent(e)}>
      {/* 为了呈现滚动条 */}
      <div style={{height: listHieght}} className={styles.ableScroll} />
      {/* 渲染列表 */}
      <div ref={itemsRef} style={{transform: getTransform}}>
        {
          visiableData.map((item, index) => (
            <div key={index} style={{padding: '10px'}}>{item}</div>
          ))
        }
      </div>
    </div>
  )
}