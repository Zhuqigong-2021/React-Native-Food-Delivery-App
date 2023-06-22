import sanityClient from "./sanity";
let sanityQuery = (query, params) => sanityClient.fetch(query, params);

export const getFeaturedRestaurants = () => {
  return sanityQuery(`
        *[_type == 'featured'] {
            ...,
            restaurants[]->{
            ...,
            type->{
                ...,
               name
            },
            dishes[]->
            }
        }
    `);
};
export const getAllRestaurants = () => {
  return sanityQuery(` *[_type == 'restaurant']{
    ...,
    type->{
     name
   }
  ,
   
   dishes[]->{
              ...
            },
              type->{
              
              }
            }`);
};
export const getAllDishes = () => {
  return sanityQuery(`
        *[_type == 'dish']
    `);
};

export const getCategories = () => {
  return sanityQuery(`
        *[_type == 'category']
    `);
};

export const getFeaturedResturantById = (id) => {
  return sanityQuery(
    `
        *[_type == 'featured' && _id == $id] {
            ...,
            restaurants[]->{
                ...,
                dishes[]->,
                type->{
                    name
                }
            }
        }[0]
    `,
    { id }
  );
};

export const getRestById = (id) => {
  return sanityQuery(
    `*[_type == 'restaurant' && _id == $id]{
          ...,
          type->{
           name
         }
        ,
         
         dishes[]->{
                    ...
                  },
                    type->{
                    
                    }
                  }
    `,
    { id }
  );
};
