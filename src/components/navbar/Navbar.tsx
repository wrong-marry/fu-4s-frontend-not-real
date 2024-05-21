import {
  Button,
  Menu,
  rem,
  Avatar,
  Group,
  Text,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import logo from "../../assets/logo.svg";
import {
  NavLink,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import {
  IconPhoto,
  IconMessageCircle,
  IconLibraryPlus,
  IconSquarePlus,
  IconSettings,
  IconUserCircle,
  IconPremiumRights,
  IconLogout,
} from "@tabler/icons-react";

import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useContext, useEffect } from "react";
import { UserCredentialsContext } from "../../store/user-credentials-context";
import { useDisclosure } from "@mantine/hooks";
import FolderModal from "../modal/navbar/create/FolderModal";
import ClassModal from "../modal/navbar/create/ClassModal";
import GeneralSearchBar from "./search/GeneralSearchBar";
import { toast } from "react-toastify";

const userBtn = (data: LoaderData, submit: any, handleLogout: () => void) => {
  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Group className="cursor-pointer border-none">
            <Avatar
              variant="filled"
              radius="xl"
              color="grape"
              className="cursor-pointer"
              src={data?.avatar}
            />
            <Text className="text-sm font-semibold">
              {data ? data.firstName + " " + data.lastName : "Guest"}
            </Text>
          </Group>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Menu</Menu.Label>
          <NavLink to={"/user/profile/sets"}>
            <Menu.Item
              leftSection={
                <IconUserCircle style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Profile
            </Menu.Item>
          </NavLink>

          <NavLink to={"/settings"}>
            <Menu.Item
              leftSection={
                <IconSettings style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Settings
            </Menu.Item>
          </NavLink>

          <Menu.Item
            leftSection={
              <IconPremiumRights style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Upgrade to Premium
          </Menu.Item>

          <Menu.Divider />
          <Menu.Item
            color="red"
            leftSection={
              <IconLogout style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={() => {
              submit(null, { method: "post", action: "/logout" });
              handleLogout();
            }}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

const guestBtn = (mode: string) => {
  return (
    <>
      <NavLink to="/auth?mode=login">
        <Button variant={"light"} color="indigo" radius="md" fz="sm">
          Login
        </Button>
      </NavLink>

      <NavLink to="/auth?mode=register">
        <Button variant="filled" color="indigo" radius="md" fz="sm">
          Signup
        </Button>
      </NavLink>
    </>
  );
};

interface LoaderData {
  error?: boolean;
  userId: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  telephone: string;
  role: string;
  premium: boolean;
  banned: boolean;
  accountType: string;
  avatar: string;
}

function Navbar() {
  const [opened, { open, close }] = useDisclosure(false);
  const [classOpened, { open: classOpen, close: classClose }] =
    useDisclosure(false);

  const { assignUserCredentials, clearUserCredentials } = useContext(
    UserCredentialsContext
  );
  const mode = useSearchParams()[0].get("mode");
  const data: LoaderData = useLoaderData() as LoaderData;
  useEffect(() => {
    if (data !== null) {
      assignUserCredentials({
        ...data,
      });
    }
  }, [data]);

  useEffect(() => {
    if (data?.banned) {
      submit(null, { method: "post", action: "/logout" });
      toast.error("Your account has been banned");
    }
  }, [data]);
  const submit = useSubmit();
  const { colorScheme, setColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const computedColorScheme = useComputedColorScheme("light");
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };
  const btnState =
    data?.error || !data
      ? guestBtn(mode as string)
      : userBtn(data, submit, clearUserCredentials);
  const whichHomepage = data?.error || !data ? "/" : "/home";

  return (
    <>
      <header className="w-full h-16 flex items-center justify-between sticky top-0 z-20 shadow-sm bg-[--mantine-color-body]">
        <div className="flex items-center w-full">
          <NavLink to={whichHomepage} className="w-32 mx-5">
            <img src={logo} alt="hehelogo" />
          </NavLink>

          <div className="ml-5 flex items-center">
            <NavLink to={whichHomepage} className="no-underline">
              {({ isActive }) => (
                <Button
                  autoContrast
                  color="indigo"
                  variant={isActive ? "light" : "subtle"}
                >
                  Home
                </Button>
              )}
            </NavLink>
            <NavLink to="/user/profile/class" className="no-underline">
              {({ isActive }) => (
                <Button
                  autoContrast
                  color="indigo"
                  variant={isActive ? "light" : "subtle"}
                >
                  Classes
                </Button>
              )}
            </NavLink>
          </div>

          <div className="ml-5 grow">
            <GeneralSearchBar />
          </div>

          <Group className="mx-5">
            <DarkModeSwitch
              checked={colorScheme === "dark"}
              onChange={toggleColorScheme}
              size={20}
            />
            <Menu trigger="hover" shadow="md" width={200}>
              <Menu.Target>
                <IconSquarePlus className="w-5 h-auto" />
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Create</Menu.Label>
                <NavLink to={"/create-quiz"}>
                  <Menu.Item
                    leftSection={
                      <IconLibraryPlus
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    Quiz set
                  </Menu.Item>
                </NavLink>

                <Menu.Item
                  onClick={open}
                  leftSection={
                    <IconMessageCircle
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  Folder
                </Menu.Item>

                <Menu.Item
                  onClick={classOpen}
                  leftSection={
                    <IconPhoto style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Classes
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Group>{btnState}</Group>
          </Group>
        </div>
      </header>

      <FolderModal opened={opened} close={close} />
      <ClassModal opened={classOpened} close={classClose} />
    </>
  );
}

export default Navbar;
