const db = require("../database/db");
const httpstatus = require("../util/httpstatus");

const sendToken = require("../util/jwtToken");

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
        IssuingAuthority:IssuingAuthority
      })
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

module.exports = {
  contactInformation,
};
