"use client"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Header() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    const confirmLogout = confirm("Are you sure you want to log out?")
    if (!confirmLogout) return;
    logout()
    router.push("/login")
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Task✔️Master
        </Link>
        <nav>
          {isAuthenticated ? (
            <Button onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <div className="space-x-2">
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
