import classNames from "classnames";
import { FC, DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { FiArrowUp } from "react-icons/fi";

export const SendButton: FC<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  return (
    <button
      className={classNames(
        "disabled:opacity-50 disabled:cursor-not-allowed shrink-0 w-[48px] h-[48px] rounded-full relative active:opacity-90 duration-75",
        "bg-gov-red",
        className
      )}
      {...props}
    >
      <FiArrowUp
        size={28}
        className='text-white absolute z-10 top-1/2 left-1/2'
        style={{
          transform: 'translate(-50%, -50%)',
          zIndex: 3
        }}
        strokeWidth={2.5}
      />
    </button>
  )
}
