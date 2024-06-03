import React, { ChangeEvent, useRef } from 'react';

/** 非受控组件 */
export default function UnControlledComponent() {
  console.log('...render');

  // 通过 inputRef.current?.value 也可以获取 value
  const inputRef = useRef<HTMLInputElement>(null);

  // 通过 onChange 事件可以获取 value
  const handleChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.value);
  };

  return (
    <div>
      <input type="text" ref={inputRef} placeholder="非受控组件" defaultValue={''} onChange={handleChangeValue} />
    </div>
  );
}
