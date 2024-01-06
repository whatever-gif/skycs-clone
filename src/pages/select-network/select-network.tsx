import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "@packages/contexts/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ccsApi, useClientgateApi } from "@/packages/api";
import "./style.scss";
import background from "/images/background/background.png";

export const SelectNetworkPage = () => {
  const NetworkID: string = `${import.meta.env.VITE_NETWORK_FIX}`;
  const navigate = useNavigate();
  const { selectNetwork, auth } = useAuth();
  const [list, setList] = useState<any[]>([]);

  const { t: common } = useI18n("Common");

  const api = useClientgateApi();

  useEffect(() => {
    (async function () {
      try {
        // const resp: any = await api.GetMyOrgList();

        const resp: any = await ccsApi.getNetworks();

        if (resp?.Success) {
          // const data: any = resp?.Data?.Lst_OS_Inos_Org;
          const data: any = resp?.Data;

          if (data.length === 1) {
            selectNetwork(data[0].Id);
            navigate(`/${data[0].Id}`);
          }

          if (data.length > 1) {
            setList(data);
          }

          if (data?.length <= 0) {
            toast.error(common("Get network error!"));
          }
        } else {
          toast.error(common("Get network error!"));
        }
      } catch (e) {}
    })();
  }, [auth]);

  const handleChooseNetwork = (id: string) => {
    selectNetwork(id);
    navigate(`/${id}`);
  };

  const normalIcon = () => {
    return (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="19.5"
          height="19.5"
          viewBox="0 0 19.5 19.5"
          className="network-icon"
        >
          <defs>
            <linearGradient
              id="linear-gradient"
              x1="0.5"
              x2="0.5"
              y2="1"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0" stop-color="#007acb" />
              <stop offset="1" stop-color="#88cfff" />
            </linearGradient>
          </defs>
          <g id="ic_organization" transform="translate(-0.924 -0.934)">
            <path
              id="Ellipse_238"
              data-name="Ellipse 238"
              d="M9-.75A9.75,9.75,0,1,1-.75,9,9.761,9.761,0,0,1,9-.75Zm0,18A8.25,8.25,0,1,0,.75,9,8.259,8.259,0,0,0,9,17.25Z"
              transform="translate(1.674 1.684)"
              fill="url(#linear-gradient)"
            />
            <path
              id="Line_412"
              data-name="Line 412"
              d="M18,.75H0A.75.75,0,0,1-.75,0,.75.75,0,0,1,0-.75H18a.75.75,0,0,1,.75.75A.75.75,0,0,1,18,.75Z"
              transform="translate(1.674 10.684)"
              fill="url(#linear-gradient)"
            />
            <path
              id="Path_15086"
              data-name="Path 15086"
              d="M11.473,1.25a.75.75,0,0,1,.554.244,14.031,14.031,0,0,1,3.67,9.174q0,.016,0,.031a14.031,14.031,0,0,1-3.67,9.174.75.75,0,0,1-1.108,0A14.031,14.031,0,0,1,7.25,10.7q0-.016,0-.031a14.031,14.031,0,0,1,3.67-9.174A.75.75,0,0,1,11.473,1.25ZM14.2,10.684a12.531,12.531,0,0,0-2.723-7.529A12.531,12.531,0,0,0,8.75,10.684a12.531,12.531,0,0,0,2.723,7.529A12.531,12.531,0,0,0,14.2,10.684Z"
              transform="translate(-0.799 0)"
              fill="url(#linear-gradient)"
            />
          </g>
        </svg>
      </div>
    );
  };

  return (
    <>
      {list?.length > 1 && (
        <section className="h-full w-full">
          <div
            className="sidebar-page h-full w-full flex items-center justify-center"
            style={{
              backgroundImage: `url(${background})`,
              backgroundPosition: "50% 50%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="bg-white w-[50%] h-[75%] rounded-[13px] shadow-2xl flex items-center flex-col p-[10px] gap-[10px]">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="62.796"
                  height="62.796"
                  viewBox="0 0 62.796 62.796"
                >
                  <defs>
                    <pattern
                      id="pattern"
                      preserveAspectRatio="none"
                      width="100%"
                      height="100%"
                      viewBox="0 0 461 453"
                    >
                      <image
                        width="461"
                        height="453"
                        xlinkHref="data:image/png;base64,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"
                      />
                    </pattern>
                  </defs>
                  <rect
                    id="logo_Qservice.png1"
                    width="62.796"
                    height="62.796"
                    fill="url(#pattern)"
                  />
                </svg>
              </div>
              <p className="font-extrabold text-xl uppercase text-[#098850]">
                chào mừng bạn đến với hệ thống igoss
              </p>
              <p className="italic text-base">
                Tài khoản của bạn được liên kết với nhiều tổ chức. Vui lòng chọn
                bắt đầu làm việc tại:
              </p>

              <section className="w-full flex flex-col gap-[10px] px-[30px] mt-[20px] overflow-y-auto">
                {list.map((i: any) => {
                  return (
                    <div
                      className="network-item rounded-[3px] min-h-[50px] flex items-center p-[10px] text-[#007ACB] hover:bg-[#007ACB] hover:text-white duration-200 cursor-pointer transition-all uppercase font-semibold gap-[10px]"
                      onClick={() => handleChooseNetwork(i?.Id)}
                    >
                      {normalIcon()}
                      <p>{i?.Name}</p>
                    </div>
                  );
                })}
              </section>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

{
  /* <h6 key={i.Id} className="p-2">
<div
  className="cursor-pointer font-semibold text-[#00703c] "
  onClick={() => handleChooseNetwork(i.Id)}
>
  {i.Name}
</div>
</h6> */
}
