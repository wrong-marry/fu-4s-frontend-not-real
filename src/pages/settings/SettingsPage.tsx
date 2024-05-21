import axios from "axios";
import Settings from "../../components/settings/Settings";
export interface UpdateProfileRequest {
  accountType: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  telephone: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface UpdateAvatarRequest {
  avatar: string;
}

interface RequestFields
  extends UpdateAvatarRequest,
    ChangePasswordRequest,
    UpdateProfileRequest {
  userId: string;
  actionType: string;
}

function SettingsPage() {
  return <Settings />;
}

const action = async ({ request }: { request: Request }) => {
  try {
    const method = request.method;
    const data = Object.fromEntries(
      await request.formData()
    ) as unknown as RequestFields;
    const actionType = data?.actionType;

    const url: Record<string, any> = {
      PUT: {
        "update-avatar": `http://localhost:8080/api/v1/users/update-avatar?id=${data?.userId}`,
        "update-profile": `http://localhost:8080/api/v1/users/update-profile?id=${data?.userId}`,
      },
      PATCH: {
        "update-password": `http://localhost:8080/api/v1/users/change-password`,
      },
    };

    const payload: Record<string, any> = {
      PUT: {
        "update-avatar": {
          avatar: data?.avatar as string,
        },
        "update-profile": {
          accountType: data?.accountType,
          email: data?.email,
          firstName: data?.firstName,
          lastName: data?.lastName,
          telephone: data?.telephone,
          userName: data?.userName,
        },
      },
      PATCH: {
        "update-password": {
          currentPassword: data?.currentPassword,
          newPassword: data?.newPassword,
          confirmPassword: data?.confirmPassword,
        },
      },
    };
    const successMsg: Record<string, any> = {
      PUT: {
        "update-avatar": "Update avatar successfully",
        "update-profile": "Update profile successfully",
      },
      PATCH: {
        "update-password": "Update password successfully",
      },
    };

    const errorMsg: Record<string, any> = {
      PUT: {
        "update-avatar": "Update avatar failed",
        "update-profile": "Update profile failed",
      },
      PATCH: {
        "update-password": "Wrong current password. Update password failed",
      },
    };

    const url1 = url[method as keyof typeof url][actionType];
    const payload1 = payload[method as keyof typeof payload][actionType];

    if (url1 && payload1 !== null) {
      await axios
        .request({
          method,
          url: url1,
          data: payload1,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AT")}`,
          },
        })
        .catch(() => {
          throw new Error(
            (
              errorMsg[method as keyof typeof errorMsg] as Record<
                string,
                string
              >
            )[actionType]
          );
        });
    }

    return {
      error: false,
      msg: (
        successMsg[method as keyof typeof successMsg] as Record<string, string>
      )[actionType],
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: true,
        msg: error.message,
      };
    }
  }
};
const loader = ({}) => {
  return null;
};
export { action as settingsAction, loader as settingsLoader };
export default SettingsPage;
