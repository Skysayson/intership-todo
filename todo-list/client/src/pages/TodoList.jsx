import { useSelector } from "react-redux"

function TodoList() {
  const { token } = useSelector((state) => state.login)

  return (
    <div>{token}</div>
  )
}

export default TodoList