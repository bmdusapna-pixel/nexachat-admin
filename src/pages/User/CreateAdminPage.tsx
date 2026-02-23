import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import image from "@/assets/images/user.png";
import AdminForm from "@/component/user/AdminFormDialog";

const CreateAdminPage = (props: any) => {

    return (
        <div className="mainCategory">
            <AdminForm />
        </div>
    )
}

CreateAdminPage.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default CreateAdminPage;