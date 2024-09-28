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
        "disabled:opacity-75 disabled:cursor-not-allowed shrink-0 w-[48px] h-[48px] rounded-full relative shadow-md shadow-neutral-400 active:opacity-90 duration-150",
        className
      )}
      {...props}
    >
      <div
        className='rounded-full h-full w-full absolute z-10 top-1/2 left-1/2'
        style={{
          background: 'linear-gradient(0deg, rgba(100,100,100,1) 0%, rgba(40,40,40,1) 100%)',
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}
      />
      <div
        className='rounded-full h-[95%] w-[95%] absolute z-10 top-1/2 left-1/2'
        style={{
          background: 'linear-gradient(0deg, rgba(130,130,130,1) 0%, rgba(40,40,40,1) 50%, rgba(130,130,130,1) 100%)',
          transform: 'translate(-50%, -50%)',
          zIndex: 2
        }}
      />
      <div
        className='rounded-full h-[84%] w-[84%] absolute z-10 top-1/2 left-1/2 shadow-inset shadow-neutral-900'
        style={{
          background: 'linear-gradient(0deg, rgba(172,16,41,1) 50%, rgba(213,35,63,1) 100%)',
          transform: 'translate(-50%, -50%)',
          zIndex: 3
        }}
      />
      <FiArrowUp
        size={28}
        className='text-neutral-200 absolute z-10 top-1/2 left-1/2'
        style={{
          transform: 'translate(-50%, -50%)',
          zIndex: 3
        }}
        strokeWidth={2.5}
      />
    </button>
  )
}