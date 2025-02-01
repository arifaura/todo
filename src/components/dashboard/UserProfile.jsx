import { useTask } from '../../context/TaskContext'

function UserProfile() {
  const { user } = useTask()

  return (
    <div className="flex items-center space-x-4">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-medium text-gray-900">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  )
}

export default UserProfile 