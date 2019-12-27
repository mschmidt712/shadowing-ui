import genders from '../../constants/genders';

export default function findGender(genderVal) {
  return genders.find(obj => obj.value == genderVal).name;
};