import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useImageCheckHook from "@/hooks/useImageCheckHook";
import { baseURL } from "@/service/service.axios";
import { handleDownload } from "@/utils/imageDownloader";
import { BsDownload, BsX } from "react-icons/bs";

interface IProp {
  name: string;
  image: string;
  bio: string;
  files: any;
  handelClick: () => void;
}
const Detail = ({ name, files, handelClick, image, bio }: IProp) => {
  const { imageUrl } = useImageCheckHook(image);

  return (
    <div className="w-full sm:border-l-2 h-[100vh]">
      <div className="grid relative place-items-center h-2/6 border-b-[1px]">
        <div className="flex flex-col justify-center items-center gap-4">
          <img
            className="w-20 bg-neutral-200 dark:bg-neutral-800/60 rounded-full"
            src={imageUrl}
            alt=""
          />
          <p className="font-medium">{name}</p>
        </div>
        <button onClick={handelClick}>
          <BsX className="absolute top-4 right-4" size={22} />
        </button>
      </div>
      <div className="py-6 max-h-[calc(100vh-250px)] overflow-scroll px-[8px] sm:px-[14px]">
        <span>{bio}</span>
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-normal">Images</AccordionTrigger>
            <AccordionContent className=" relative grid grid-cols-2 gap-x-2 gap-y-4">
              {files &&
                files.length > 0 &&
                files?.map(
                  (file: any) =>
                    file &&
                    file.image && (
                      <div className="relative">
                        <img
                          className="w-[250px] rounded-[8px] "
                          src={`${baseURL}/uploaded_images/${file?.image}`}
                          alt="image"
                        />
                        <BsDownload
                          onClick={() =>
                            handleDownload({
                              imageUrl: `${baseURL}/uploaded_images/${file?.image}`,
                              fileName: "image",
                            })
                          }
                          className="absolute text-white top-2 right-2"
                          size={20}
                        />
                      </div>
                    )
                )}
              {files && files.length === 0 && (
                <p className="text-center">No image share yet.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Detail;
