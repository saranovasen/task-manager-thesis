type SecondaryTextProps = {
  text: string;
};

export const SecondaryText = ({ text }: SecondaryTextProps) => {
  return <p style={{ color: '#8C97A8', fontSize: 16, whiteSpace: 'pre-line' }}>{text}</p>;
};
