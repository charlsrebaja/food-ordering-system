import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UsersTable } from './users-table'

async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          orders: true,
          restaurants: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return users
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-muted-foreground">
          Manage user accounts and roles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} />
        </CardContent>
      </Card>
    </div>
  )
}