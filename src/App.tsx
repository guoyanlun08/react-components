import React from 'react';
import VirtualList from './components/VirtualLists'
import VirtualListsDynamic from './components/VirtualListsDynamic'

function App() {
  return (
    <div className="App">
      {/* <VirtualList/> */}
      <VirtualListsDynamic />
    </div>
  );
}

export default App;
