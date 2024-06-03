import React, { useEffect, useState, useRef } from 'react';

type PropsType = {
  defaultValue?: string;
  value?: string;
  onChange?: () => void;
};
/** 受控和非受控模式的组件 */
export default function ControlledAndUnControlled(props: PropsType) {
  const { defaultValue, value: propsValue, onChange } = props;

  const isFirstRender = useRef(true);
  const [value, setValue] = useState(() => {
    if (propsValue !== undefined) {
      // 代表 受控
      return propsValue;
    } else {
      // 代表 非受控
      return defaultValue;
    }
  });

  useEffect(() => {
    // 受控组件情况下，每次值改变，内部也要改变
    if (propsValue !== undefined && !isFirstRender.current) {
      setValue(propsValue);
    }

    isFirstRender.current = false;
  }, [propsValue]);

  const mergedValue = propsValue === undefined ? value : propsValue;

  function changeValue(data: string) {
    //非受控改变内部值
    if (propsValue === undefined) {
      setValue(data);
    }

    onChange?.();
  }

  return (
    <>
      <div>{mergedValue}</div>
      <div onClick={() => changeValue('123')}>点击触发</div>
    </>
  );
}
