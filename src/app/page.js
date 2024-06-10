import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import FormInput from "./components/FormInput";
import { getItems, deleteItem } from "@/actions";
import ButtonDelete from "./components/ButtonDelete";
import EditForm from "./components/EditForm";

async function Home() {
  const user = await currentUser();

  let items = [];
  if (user) {
    const response = await getItems(user.id);
    if (response.success) {
      items = response.data;
    } else {
      console.error("Error fetching items:", response.error);
    }
  }

  const menuItems = [
    {
      label: "Home",
      path: "/",
      show: true,
    },
    {
      label: "listofpost",
      path: "/listofpost",
      show: true,
    },
    {
      label: "Login",
      path: "/sign-in",
      show: !user,
    },
    {
      label: "Register",
      path: "/sign-up",
      show: !user,
    },
  ];

  return (
    <main>
      <nav className="flex gap-[20px] py-[20px] px-[40px]">
        {menuItems.map((item) =>
          item.show ? (
            <Link href={item.path} key={item.label}>
              {item.label}
            </Link>
          ) : null
        )}
        <UserButton afterSignOutUrl="/" />
      </nav>
      <div className="mt-[20px] px-[40px]">
        <h2 className="text-[50px] font-bold">Let's build</h2>
        {user && (
          <div>
            <h2 className="text-[18px] font-bold mt-[25px]">{user.fullName}</h2>
            <p>{user.primaryEmailAddress.emailAddress}</p>
            <div className="mt-[15px]">
              <FormInput />
            </div>
            <div>
              <ul>
                {items.map((item) => (
                  <li
                    key={item._id}
                    className="p-[10px] border-[1px] mt-[50px] flex justify-between items-center"
                  >
                    <div>
                      <span className="text-[#f7f7f7] p-[8px] rounded-[5px] bg-[#0c0c0c]">
                        {user.fullName}
                      </span>{" "}
                      : {item.name} - {item.email}
                      {item.imageUrl && (
                        <div>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            width={500}
                            className="mt-[10px] max-w-[200px]"
                          />
                        </div>
                      )}
                    </div>
                    <EditForm item={item} userId={user.id} />
                    <ButtonDelete itemId={item._id} userId={user.id} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;
