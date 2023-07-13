import {MultiChatSocket,MultiChatWindow,useMultiChatLogic} from 'react-chat-engine-advanced'
const ChatsPage = (props) => {
    const chatProps = useMultiChatLogic(
    '5e395d86-327f-408a-84a4-f4c8cf354f1e',
    props.user.username ,
    props.user.secret)
  
  return (<div style={{height:'100vh'}}>
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow {...chatProps}  style={{height: '100%'}}/>
  </div>
  )

};
  export default ChatsPage;