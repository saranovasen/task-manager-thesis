import './SecondaryText.css';

type SecondaryTextProps = {
  text: string;
};

export const SecondaryText = ({ text }: SecondaryTextProps) => {
  return <p className="secondary-text">{text}</p>;
};
