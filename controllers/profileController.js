const db = require("../database/db");
const httpstatus = require("../util/httpstatus");
const fs = require('fs');
const path = require('path');

// contact information start

const getContactInformation = async (req,res) => {
   try {
    const { id } = req.body
    const result = await db('ContactInformation').select('*').where({ userid:id }).first();
    if(result){
      return res.send(httpstatus.successRespone(
        { 
          message: "Contact Information", 
          response: result
        }
        ));
    }else{
      return res.send(httpstatus.notFoundResponse({ message: null }));

    }
   } catch (error) {
     return res.send(httpstatus.errorRespone({ message: error.message }));

   }
}

const contactInformation = async (req, res) => {
  try {
    const {
      userid,
      Street,
      place,
      taluk,
      district,
      zipcode,
      idproof,
      idnumber,
      issueDate,
      country,
      IssuingAuthority,
      plotnumber,
      plotname
    } = req.body;

       db("ContactInformation")
      .insert({
        userid:userid,
        Street:Street,
        place:place,
        taluk:taluk,
        district:district,
        zipcode:zipcode,
        idproof:idproof,
        idnumber:idnumber,
        issueDate:issueDate,
        country:country,
        IssuingAuthority:IssuingAuthority,
        plotnumber:plotnumber,
        plotname:plotname

      }).returning('*')
      .then((response) => {
        return res.send(httpstatus.successRespone(
          { 
            message: "Contact Information inserted successfully", 
            response: response }
          ));

      })
      .catch((error) => {
        return res.send(httpstatus.errorRespone({ message: error.message }));

      });
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
};


const ContactUpdate = async (req, res) => {
  try {
    const {
      userid,
      Street,
      place,
      taluk,
      district,
      zipcode,
      idproof,
      idnumber,
      issueDate,
      country,
      IssuingAuthority,
      plotnumber,
      plotname
    } = req.body;

    db('ContactInformation').update({
       userid:userid,
        Street:Street,
        place:place,
        taluk:taluk,
        district:district,
        zipcode:zipcode,
        idproof:idproof,
        idnumber:idnumber,
        issueDate:issueDate,
        country:country,
        IssuingAuthority:IssuingAuthority,
        plotnumber:plotnumber,
        plotname:plotname
    }).where({ userid : userid })
    .returning('*')
    .then((response)=>{
      return res.send(httpstatus.successRespone(
        { 
          message: "Contact Information Updated successfully", 
          response: response }
        ));
    }).catch((error)=>{
      return res.send(httpstatus.errorRespone({ message: error.message }));
    })
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
}

// contact information end


// Personal Details start
const fetchInformation = async (req,res) => {
  try {
   const { id,table } = req.body
   console.log(req.body);
   const result = await db(table).select('*').where({ userid:id }).first();
  
   const jobSkills = await db('JobSkills').select('*').where({ jod_details_id:result.id });
   if(result){
    return res.send(httpstatus.successRespone({
      message: "Details Fetched",
      response: result,
      jobSkills: jobSkills,
    }));
    
   }else{
     return res.send(httpstatus.notFoundResponse({ message: null }));

   }
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));

  }
}


const fetchLoopInformation = async (req,res) => {
  try {
   const { id,table } = req.body
   console.log(req.body);
   const result = await db(table).select('*').where({ userid:id });
  
   
   if(result){
    return res.send(httpstatus.successRespone({
      message: "Fetch Home Appliance Details",
      response: result,
    }));
    
   }else{
     return res.send(httpstatus.notFoundResponse({ message: null }));

   }
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));

  }
}


const getEditData_HomeAppliance = async (req,res) => {
     try {
      const { id,userid,table } = req.body;

      const result = await db(table).select('*').where({id:id,userid:userid});
      return res.send(httpstatus.successRespone({
        message: "Fetch Edited Data In Home Appliance",
        response: result,
      }));
       
     } catch (error) {
      return res.send(httpstatus.errorRespone({ message: error.message }));
     }
}



const update_HomeAppliance = async (req, res) => {
  try {
    const { id, userid, table, formdata, message } = req.body;

    console.log(req.body);
    delete formdata.id;

    // Perform the update operation
     await db(table)
      .update(formdata)
      .where({ id: id, userid: userid })
      .returning('*'); // Use '*' to return all columns; replace with specific column names if needed

    // Fetch all data from the table after the update
    const allData = await db(table).select('*').where({userid: userid });

    // Send the updated data as the response
    return res.send(httpstatus.successRespone({
      message: message,
      response: allData,
    }));
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
};


const AddUserDetails = async (req, res) => {
  try {
    const { insertdata, table, insertMessage, skills,resume } = req.body;

    console.log('resume details',resume);
    console.log(resume);
    // Insert user details and get the inserted ID
    const response = await db(table).insert(insertdata).returning('*');
    const insertedId = response[0];
    const allData = await db(table).select('*').where({userid: insertedId.userid });
    console.log('return all data',insertedId);
    if(req.file){
     await db('JobDetails').update({resume: req.file ? req.file.filename : "sads"}).where({ userid: insertedId.userid});
    }
   

    // Insert skills if provided
    if (skills && skills.length > 0) {
      await db('JobSkills').insert(
        skills.map((skillsdata) => ({
          jod_details_id: insertedId.id,
          skills: skillsdata.name,
          skills_level: skillsdata.level,
        }))
      );

      console.log('Skills added successfully');
    }

    return res.send(httpstatus.successRespone({
      message: insertMessage,
      response: table == 'HomeApplianceDetails' || table == 'VehicleDetails' || table == 'GadgetDetails' || table == 'PropertyDetails' ? allData : insertedId,
    }));
  } catch (error) {
    console.log(error);
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
};


const UpdateUserDetails = async (req, res) => {
  try {
    const {
      insertdata,table,insertMessage
    } = req.body;
    delete insertdata.id;
       db(table)
      .update(insertdata)
      .returning('*')
      .then((response) => {
        return res.send(httpstatus.successRespone(
          { 
            message: insertMessage, 
            response: response 
          
          }
          ));

      })
      .catch((error) => {
        return res.send(httpstatus.errorRespone({ message: error.message }));

      });
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
};


const upload_profileImg = async (req, res) => {
  try {
    const { id } = req.body;

    // Fetch user data from the database
    const fetchData = await db('users').select('profile_image').where({ id: id }).first();

    if (fetchData) {
      const folderPath = path.join(__dirname, '../assets/UserProfileImage', fetchData.profile_image);
      console.log(folderPath);

      // Use fs.promises.rmdir for asynchronous deletion
      await fs.promises.rm(folderPath, { recursive: true });

      // Update the profile image in the database
      if(req.file){
        const upload_profile_img = await db('users').update({ profile_image: req.file.filename }).where({ id: id }).returning('profile_image');
        const returnData = upload_profile_img[0];
        if (upload_profile_img) {
          return res.send(
            httpstatus.successRespone({ message: "Profile Image Upload Successfully..!",image:returnData.profile_image })
          );
        } else {
          return res.send(
            httpstatus.errorRespone({ message: "Image Upload Error..!" })
          );
        }
      }
     
    } else {
      if (req.file) {
        // Update the profile image in the database
        const upload_profile_img = await db('users').update({ profile_image: req.file.filename }).where({ id: id }).returning('profile_image');
        const returnData = upload_profile_img[0];
        if (upload_profile_img) {
          return res.send(
            httpstatus.successRespone({ message: "Profile Image Upload Successfully..!",image:returnData.profile_image })
          );
        } else {
          return res.send(
            httpstatus.errorRespone({ message: "Image Upload Error..!" })
          );
        }
      }
    }
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
};



module.exports = {
  contactInformation,
  getContactInformation,
  ContactUpdate,
  fetchInformation,
  AddUserDetails,
  UpdateUserDetails,
  fetchLoopInformation,
  getEditData_HomeAppliance,
  update_HomeAppliance,
  upload_profileImg
};
