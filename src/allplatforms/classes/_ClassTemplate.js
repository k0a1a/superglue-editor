SC.loadPackage({ 'myClass': {

    comment: 'my class comment.',


    sharedProperties: {

        key: 	{  	comment:   'class property comment', 
                	initValue: '1' 
                }

    },

    properties: {

        key: { comment: 'instance property comment' }

    },

    methods: {

    	key: { 
    		comment: 	'method comment',
    		code: 		function(){

    		}
    	}


    }


}});