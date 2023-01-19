import React, { useEffect, useState } from 'react';
import "rsuite/dist/rsuite.css";
import { Cascader } from 'rsuite';
import axios from 'axios';
import FolderFillIcon from "@rsuite/icons/FolderFill";
import PageIcon from "@rsuite/icons/Page";

// the config header will avoid cors blocked by the chrome
const config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  }
};

/**
 * glossary bar objects
 * @param setSelectCourse, used for seting courseId for getting glossaries
 * @param setSelectOffering, used for seting offeringId for getting glossaries
 */
export default function GlossaryBar({setSelectCourse, setSelectOffering}) {
    const [isLoading, setIsLoading] = useState(true);
    const [terms, setTerms] = useState({});
    const [initialData, setInitialData] = useState([]);

    const apiInstance = axios.create({
        baseURL: 'https://ct-dev.ncsa.illinois.edu',
        timeout: 1000,
    });

    
    // this is run at the start of the website
    // will get the list of universities and get all the term name for corresponding term ID
    useEffect(() => {
        let newTerms = {};
        apiInstance.get("/api/Universities", config).then(response => {
            let universityData = response.data.map((object => {
                // get terms for that university
                apiInstance.get(`/api/Terms/ByUniversity/${object.id}`, config).then(response2 => {
                    response2.data.map((term) => {
                        newTerms[term.id] = term.name
                        return undefined;
                    })
                })
    
                return {
                    label: object.name,
                    value: object.id,
                    type: 0,
                    children: [],
                }
            }))
            
            setInitialData(universityData);
            setTerms(newTerms);
            setIsLoading(false);
        })
    }, [])
    
    /**
     * function to fetch choices from the server
     * type 0: for each university, we get departments
     * type 1: for each department, we get courses
     * type 2: for each course, we get offerings
     */
    const getNodes = async (type, id) => {
        try {
            if (type === 0) {
                let res = await apiInstance.get(`/api/Departments/ByUniversity/${id}`, config);
                let resData = res.data;
                
                return resData.map((object) => {
                    return {
                        label: object.acronym,
                        value: object.id,
                        type: 1,
                        children: [],
                    }
                })
            }
            
            if (type === 1) {
                let res = await apiInstance.get(`/api/Courses/ByDepartment/${id}`, config);
                let resData = res.data;
                
                return resData.map((object) => {
                    return {
                        label:object.courseNumber,
                        value:object.id,
                        type:2,
                        children:[]
                    }
                });
            }
            
            if (type === 2) {
                let res = await apiInstance.get(`/api/CourseOfferings/ByCourse/${id}`, config);
                let resData = res.data.offerings;

                if (res.status === 204) {
                    // this course has no offerings
                    return [];
                }

                return resData.map((object) => {
                    return {
                        label:`${terms[object.termId]} ${object.sectionName}`,
                        value:object.id,
                        type:3,
                        children:null
                    }
                });
            }
        } catch (err) {
            return [{label:'error loading', value:"error", children:null}];
        }
    }

    const fetchNodes = (type, id) => {
        return new Promise(
            resolve => {
                setTimeout(
                    () => resolve(getNodes(type, id)),
                    1000
                );
            }
        )
    }

    const handleOnSelect = (e) => {
        if (e.type === 3) {
            setSelectCourse(e.parent.value);
            setSelectOffering(e.value);
        }
    }

    return (
      <div className="example-item">
        <Cascader
          onSelect={(e) => handleOnSelect(e)}
          placeholder="Select your course"
          data={initialData}
          menuWidth={200}
          searchable
          getChildren={node => {
            return fetchNodes(node.type, node.value);
          }}
          renderMenuItem={(label, item) => {
              return (
                <>
                  {item.children ? <FolderFillIcon /> : <PageIcon />} {label}
                </>
              );
          }}
          renderMenu={(children, menu, parentNode) => {
              if (parentNode && parentNode.loading) {
                  return <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>Loading...</p>;
              }
              return menu;
          }}
        />
      </div>
    )
}