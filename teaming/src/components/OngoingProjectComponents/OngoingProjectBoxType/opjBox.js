import React from "react";
import "../../../pages/OngoingProject/OngoingProject.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch } from "react-router-dom";
import { FiTrash2 } from 'react-icons/fi';
import styled from "styled-components";
import axios from "axios";
import { useRecoilState } from "recoil";
import { memberIdState } from "../../atom";
import { useQueryClient } from "react-query";

const Delete = styled.button`
  margin-bottom:5px;
  .delete-button:hover {
    color: #FF000080;
  }
`;

const OPjBox = ({ project }) => {
  const defaultImage = "/img/projectImg/project_img.jpg"; // 기본 이미지 경로 설정
  const matchProgressProjects = useMatch("/ongoingProject");
  const [memberId] = useRecoilState(memberIdState);
  const queryClient = new useQueryClient();

  const onDelete = (e) => {
      e.preventDefault();
      if (
        window.confirm(
          "삭제한 프로젝트는 되돌릴 수 없습니다. 그래도 삭제하시겠습니까? "
        )
      ) {
        axios
        .delete(
          `${process.env.REACT_APP_API_URL}/projects/${memberId}/${project.projectId}/deletes`
        )
        .then((response) => {
          console.log(response);
          if (matchProgressProjects) {
            queryClient.invalidateQueries("ongoingProject");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
    };

    const handleImageError = (e) => {
      e.target.src = defaultImage; 
    };


  return (
    <Link to={`/${project.projectId}/project-files`}>
      <div className="box">
        <div className="thumbNail">
          <img
            className="thumbNailPic"
            src={project.projectImage || defaultImage}
            alt={project.projectName}
            onError={handleImageError}
          />
          <span className="progressing">
            <span className="circle ">
              <FontAwesomeIcon color="#527FF5" icon={faCircle} />
            </span>
          </span>
        </div>
        <div className="projectInfo">
          <p className="h4">{project.projectName}</p>
          <br />
          <p className="p">
            {project.projectStartDate}~{project.projectEndDate}
            <Delete onClick={onDelete}>
              <FiTrash2 size="19" className="delete-button" />
            </Delete>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default OPjBox;
