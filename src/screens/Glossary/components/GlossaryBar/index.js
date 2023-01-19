import React, { useState } from 'react';
import "rsuite/dist/rsuite.css";
import { Cascader } from 'rsuite';
import axios from 'axios';
import FolderFillIcon from "@rsuite/icons/FolderFill";
import PageIcon from "@rsuite/icons/Page";
import { useEffect } from 'react';

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

    
    //this is run at the start of the website
    //will get the list of universities and get all the term name for corresponding term ID
    useEffect(() => {
        let newTerms = {};
        apiInstance.get("/api/Universities", config).then(response => {
            let universityData = response.data.map((object => {
                //get terms for that university
                apiInstance.get("/api/Terms/ByUniversity/" + object.id, config).then(response => {
                    response.data.map((terms) => {
                        newTerms[terms.id] = terms.name
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
            let res = undefined;
            let resData = undefined;

            switch(type) {
                case 0:
                    //get department for university
                    res = await apiInstance.get("/api/Departments/ByUniversity/" + id, config);
                    resData = res.data;
                    
                    return resData.map((object) => {
                        return {
                            label: object.acronym,
                            value: object.id,
                            type: 1,
                            children: [],
                        }
                    })

                case 1:
                    res = await apiInstance.get("/api/Courses/ByDepartment/"+id, config);
                    resData = res.data;
                    
                    return resData.map((object) => {
                        return {
                            label:object.courseNumber,
                            value:object.id,
                            type:2,
                            children:[]
                        }
                    });

                case 2:
                    res = await apiInstance.get("/api/CourseOfferings/ByCourse/"+id, config);
                    resData = res.data.offerings;

                    if (res.status === 204) {
                        //this course has no offerings
                        return [];
                    } else {
                        return resData.map((object) => {
                            return {
                                label:terms[object.termId] + " " +object.sectionName,
                                value:object.id,
                                type:3,
                                children:null
                            }
                        });
                    }

                default:
                    return [];
            }
        } catch (err) {
            console.log("raise error");
            console.log(err);
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
        console.log("on select");
        console.log(e.type);
        if (e.type === 3) {
            console.log(e);
            console.log(e.value);
            console.log(e.parent.value);

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
                searchable={true}
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