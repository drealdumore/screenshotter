import React from "react";

interface Props {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<Props> = ({ message, className }) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive ${className}`}
      role="alert"
    >
      <ErrorIcon class="h-5 w-5 flex-shrink-0" />
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default ErrorMessage;

const Icon = (props: {
  children: any;
  size?: number;
  class?: string;
  stroke?: 2 | 1.5;
}) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    className={props.class}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {props.children}
  </svg>
);

export const ErrorIcon = (props: {
  size?: number;
  class?: string;
  stroke?: 2 | 1.5;
  fill?: string;
}) => {
  return (
    <Icon size={props.size} class={props.class}>
      <path
        fill="currentColor"
        d="M13 12a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0zM12 9.5A1.25 1.25 0 1 0 12 7a1.25 1.25 0 0 0 0 2.5"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0"
        clipRule="evenodd"
      ></path>
    </Icon>
  );
};
