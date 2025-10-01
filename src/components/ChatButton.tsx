import {
  InkeepChatButton,
  type InkeepChatButtonProps,
} from '@inkeep/cxkit-react-oss';

const buttonProps: InkeepChatButtonProps = {
  aiChatSettings: {
    graphUrl:
      process.env.NEXT_PUBLIC_INKEEP_GRAPH_URL ||
      'https://inkeep-agents-run-api.vercel.app/api/chat',
    apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY || '',
  },
};

const ChatButton = () => {
  return <InkeepChatButton {...buttonProps} />;
};

export default ChatButton;
