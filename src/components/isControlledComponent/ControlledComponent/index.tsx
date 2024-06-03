import React, { ChangeEvent, useState } from 'react';

/** 受控组件 */
export default function ControlledComponent() {
  // 每次输入都会 setValue，然后触发组件重新渲染
  console.log('...render');

  const [value, setValue] = useState('');

  const handleChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    //去掉 setValue 就改变不了 ---
    setValue(event.target.value);
  };

  return (
    <div>
      <input type="text" placeholder="受控组件" value={value} onChange={handleChangeValue} />
    </div>
  );
}
