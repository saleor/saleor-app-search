import dynamic from "next/dynamic";

const ClientContent = dynamic(() => import("../components/ConfigurationView"), {
  ssr: false,
});

const IndexPage = () => {
  return <ClientContent />;
};

export default IndexPage;
