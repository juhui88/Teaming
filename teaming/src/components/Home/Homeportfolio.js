import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Homeportfolio.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { GoChevronRight } from "react-icons/go";

// datas > home.json데이터 가져와야 함
// 데이터 적용 관련
import axios from "axios";
import { useRecoilState } from "recoil";
import { memberIdState, nickNameState } from "../../components/atom";

export const Homeportfolio = () => {
  const [nickName, setNickName] = useRecoilState(nickNameState);
  const [memberId, setMemberId] = useRecoilState(memberIdState);
  const [portfolio, setportfolio] = useState([]);

  useEffect(() => {
    // 여기서 외부 데이터를 가져오고 progressProject 상태를 설정하세요
    axios
      .get(`${process.env.REACT_APP_API_URL}/member/${memberId}/home`)
      .then((response) => {
        const data = response.data.data;

        // setMemberId(data.memberId);
        if (data.portfolio !== null) setportfolio(data.portfolio);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const maxItemsToShow = 8; // 최대로 보여줄 아이템 개수

  return (
    <div className="PortfolioApp">
      <div className="Portfoliotitle">
        <Link to="/portfolio">
          <p>완료된 프로젝트</p>
        </Link>
        <span className="ml-2">
          <GoChevronRight size="27" />
        </span>
      </div>
      <div className="Portfoliosubtitle">
        {nickName}님의 프로젝트를 한눈에 모아보세요!
      </div>

      {portfolio.length === 0 ? (
        // 진행 중인 프로젝트가 없을 때
        <div className="Portfolioempty">
          <div className="Portfolioemptycontent">
            <div className="emptytitle">
              <span className="emptytitlelineone">마감된</span>
              <br />
              프로젝트가 없어요
            </div>
            <div className="emptyimg"></div>
            <div className="emptysubtitle">
              <span className="emptysubtitlelineone">프로젝트를 마감하면</span>
              <br />
              지난 활동들을 모아볼 수 있어요!
            </div>
          </div>
        </div>
      ) : (
        // 진행 중인 프로젝트가 있을 때
        <div className="Portfoliocontent">
          <div className="grid-container">
            {portfolio.slice(0, maxItemsToShow).map((item, index) => (
              <div key={index} className="content">
                <Link to={`/${item.projectId}/final-files`}>
                  {item.projectStatus === "ING" ? (
                    <span className="contentprogress">
                      진행중{" "}
                      <FontAwesomeIcon
                        icon={faCircle}
                        style={{ color: "blue" }}
                      />
                    </span>
                  ) : (
                    <span className="contentprogress">
                      마감{" "}
                      <FontAwesomeIcon
                        icon={faCircle}
                        style={{ color: "yellow" }}
                      />
                    </span>
                  )}
                  <div className="contentimgs">
                    {item.projectImage && (
                      <img src={item.projectImage} alt={item.projectName} />
                    )}
                  </div>
                  <div className="contenttxt">
                    <div className="contenttitle">
                      {" "}
                      {item.projectName.length > 9
                        ? `${item.projectName.slice(0, 9)}...`
                        : item.projectName}
                    </div>
                    <div className="contentsubtitle">{`${item.projectStartDate} ~ ${item.projectEndDate}`}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
