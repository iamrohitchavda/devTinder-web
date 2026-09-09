import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import Loader from "../../components/Loader";

const Profile = () => {
  const { data: user, loading } = useSelector((store) => store.user);

  if (loading) {
    return (
      <div className="flex w-52 flex-col gap-4 justify-center items-center mx-auto mt-10">
        <Loader />
      </div>
    );
  }

  return (
    user && (
      <div>
        <EditProfile user={user} />
      </div>
    )
  );
};

export default Profile;
