import {
  InkeepChatButton,
  type InkeepChatButtonProps,
} from '@inkeep/cxkit-react-oss';

const buttonProps: InkeepChatButtonProps = {
  aiChatSettings: {
    graphUrl: 'http://localhost:3003/api/chat',
    apiKey: 'sk_GT34zW85KGFt.rmsVE21gE1WJrq7VRbPzsW3eHz00FNvb1qciCK_mqKE', // Your API key
  },
};

const ChatButton = () => {
  return <InkeepChatButton {...buttonProps} />;
};

export default ChatButton;
