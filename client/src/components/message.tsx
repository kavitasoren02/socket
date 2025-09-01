interface Props {
    message: string;
    timestamp: string;
    isRecieved?: boolean;
}

const Message = ({message, timestamp, isRecieved,} : Props) => {
    return (
        <div className={`w-full flex ${isRecieved ? 'justify-left' : 'justify-end'} mb-4 pr-2`}>
            <div className={`py-2 px-5 w-fit text-white ${isRecieved ? 'bg-gray-700' : 'bg-blue-500'}`}>
                <p>{message}</p>
                <p className="text-xs text-right">{timestamp}</p>
            </div>
        </div>
    )
}
export default Message;