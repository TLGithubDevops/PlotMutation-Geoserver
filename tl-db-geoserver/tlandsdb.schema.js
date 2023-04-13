const dynamoose = require('dynamoose');
const AWS = require('aws-sdk');
require('dotenv').config();
if (process.env.environment == "LOCAL") {
    dynamoose.aws.ddb.set(new dynamoose.aws.ddb.DynamoDB({ endpoint: process.env.DYNAMODB_ENDPOINT }))
}
/*transaction schema : will be reused in tlSchema and also for 'plotLatestTransaction'. If we modify here, it will affect in both the places*/
const transactionSchema = {
    transPropertyType: {
        type: String,
    },
    transPropertyId: {
        type: String,
    },
    transDate: {
        type: Date,
    },
    transParcipants: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                cognitoId: String,
                name: String,
                email: String,
                phone: String,
                percentage: Number,
            }
        }]
    },
    transAmount: {
        type: Number,
    },
    transPaymentMethod: {
        type: String,
    },
    transPaymentId: {
        type: String
    },
    transReferenceId: {
        type: String
    },
    previousStatus: {
        type: String
    },
    currentStatus: {
        type: String
    },
    tellerDetails: {
        type: Object,
        schema: {
            tellerId: String,
            tellerName: String,
            tellerGroup: String
        }
    },
    transNotes: {
        type: String
    }
}
//main tlSchema
const tlSchema = {
    PK: {
        type: String,
        hashKey: true
    },
    SK: {
        type: String,
        rangeKey: true
    },
    PK1: {
        type: String,
        index: {
            name: "GS1",
            global: true,
            rangeKey: 'SK1'
        }
    },
    SK1: {
        type: String
    },
    PK2: {
        type: String,
        index: {
            name: "GS2",
            global: true,
            rangeKey: 'SK2'
        }
    },
    SK2: {
        type: Date,
    },
    PK3: {
        type: String,
        index: {
            name: "GS3",
            global: true,
            rangeKey: 'SK3'
        }
    },
    SK3: {
        type: String,
    },
    gid: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        required: true
    },
    /*org details starts*/
    orgName: {
        type: String,
    },
    orgLegalName: {
        type: String,
    },
    orgShortName: {
        type: String,
    },
    orgSlug: {
        type: String,
    },
    orgContactDetails: {
        type: Object,
        schema: {
            phone: String,
            email: String,
        }
    },
    orgAddressDetails: {
        type: Object,
        schema: {
            addressLine1: String,
            addressLine2: String,
            city: String,
            subRegion: String,
            state: String,
            country: String,
            zipCode: String
        }
    },
    orgBusinessDetails: {
        type: Object,
        schema: {
            natureOfBusiness: String,
            gstNumber: String,
            businessOwner: String,
            permanentAddress: String
        }
    },
    orgBrandDetails: {
        type: Object,
        schema: {
            logoPath: String,
            logoThumb: String,
        }
    },
    orgStatus: {
        type: String,
    },
    orgAggregates: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                name: String,
                data: String
            }
        }]
    },
    isVerifiedOrg: {
        type: Boolean,
    },
    /*org ends*/
    projName: {
        type: String,
    },
    projShortName: {
        type: String,
    },
    projSlug: {
        type: String,
    },
    projDescription: {
        type: String,
    },
    projContactDetails: {
        type: Object,
        schema: {
            email: String,
            phone: String,
        }
    },
    projCategory: {
        type: String,
    },
    //propertyType renamed to projectCategories 
    propertyCategories: {/*custom tags*/
        type: Array,
        schema: [String]
    },
    tags: {
        type: Array,
        schema: [String]
    },
    //brandDetails renamed to projBrandDetails 
    projBrandDetails: {
        type: Object,
        schema: {
            coverImage: String,
            coverThumbnail: String,
        }
    },
    projStatus: {
        type: String,
        enum: ["Ongoing", "Upcoming", "Completed"]
    },
    projAggregates: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                name: String,
                data: String
            }
        }]
    },
    projLaunchDate: {
        type: Date,
    },
    projCompletedDate: {
        type: Date,
    },
    //approvalDetails renamed to authorities as per suggestion
    authorities: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                authorityName: String,
                authorityNumber: String,
            }
        }]
    },
    projGeoDataReference: {
        type: Object,
        schema: {
            lat: Number,
            lng: Number,
            label: String,
            geom: String
        }
    },
    projConfiguration: {//future enhancement?
        type: Object,
        schema: {
            hidePrice: Boolean
        }
    },
    projAddress: {
        type: Object,
        schema: {
            addressLine1: String,
            addressLine2: String,
            city: String,
            subRegion: String,
            state: String,
            country: String,
            zipCode: String
        }
    },
    projArea: {
        type: Object,
        schema: {
            areaType: String,
            area: Number,
            areaUnit: String,
        }
    },
    photos: {
        type: Array,
        schema: [String]
    },
    videos: {
        type: Array,
        schema: [String]
    },
    views360: {
        type: Array,
        schema: [String]
    },
    virtualTours: {
        type: Array,
        schema: [String]
    },
    tlTales: {
        type: Object,
        schema: {
            amenities: String,/*stringified object*/
            nearby: String,/*stringified object*/
        }
    },
    documents: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                docid: String,//uuid
                title: String,
                category: String,//brouchre
                file: String,
                cover: String,
                notes: String
            }
        }]
    },
    pricingConfig: {/*Need Discussion*/
        type: Object,
        schema: {
        }
    },
    subscriptionLevel: {/*Future Enhancement*/
        type: String,
    },
    projVisibility: {
        type: Boolean,
    },
    /*reviewed till here*/
    //Zone//skipped zone etl
    zoneName: {
        type: String,
    },
    zoneShortName: {
        type: String,
    },
    zoneSlug: {
        type: String,
    },
    zoneLaunchDate: {
        type: Date,
    },
    zoneVisibility: {
        type: String,
    },
    /*plot details start*/
    plotName: {
        type: String,
    },
    plotSlug: {
        type: String,
    },
    plotGeoDataReference: {
        type: Object,
        schema: {
            plotType: String,
            lat: Number,
            lng: Number,
            label: String,
            geom: String
        }
    },
    plotStatus: {
        type: String,
    },
    plotAreaDetails: {
        type: Object,
        schema: {
            area: Number,
            areaUnit: String,
            dimension: String
        }
    },
    plotBasePrice: {/* calculate from price config and save here*/
        type: Number,
    },
    plotPrice: {/* calculate from price config and save here*/
        type: Number,
    },
    plotFacing: {
        type: Array,
        schema: [String]
    },
    plotConfiguration: {//FE
        type: Object,
        schema: {
        }
    },
    // //Transactions
    plotLatestTransaction: {
        type: Object,
        schema: transactionSchema
    },
    /* ownershipType & ownershipPercentage required? */
    ownershipType: {
        type: String,
    },
    ownershipPercentage: {
        type: String,
    },
    //enquiry
    enquiryDate: {
        type: Date,
    },
    enquiryDesc: {
        type: String,
    },
    enquiryFirstName: {
        type: String,
    },
    enquiryLastName: {
        type: String,
    },
    enquiryPhone: {
        type: String,
    },
    enquiryEmail: {
        type: String,
    },
    enquiryConsentDeatils: {
        type: Object,
        schema: {
            emailConsent: String,
            smsConsent: String,
        }
    },
    enquiryStatus: {
        type: Boolean
    },
    enquiryType: {
        type: String
    },
    //user
    userFirstName: {
        type: String,
    },
    userLaststName: {
        type: String,
    },
    userEmail: {
        type: String,
    },
    userPhone: {
        type: Number,
    },
    userVisibility: {
        type: String,
    },
    userDetails: {
        type: Object,
        schema: {}
    },
    userCognitoID: {
        type: String,
    },
    userConsentDeatils: {
        type: Object,
        schema: {
            emailConsent: String,
            smsConsent: String,
        }
    },
}
/*Assigning "transactionSchema" into "tlSchema" */
Object.assign(tlSchema, transactionSchema);
const TLandsSchema = new dynamoose.Schema(tlSchema, { timestamps: true })
const TLands = dynamoose.model("TLands", TLandsSchema)
const DynamoTable = new dynamoose.Table("tlands", [TLands], { "prefix": process.env.DYNAMODB_TABLE_PREFIX, "create": false });
module.exports = TLands;