describe('Hello world', function(){
    it('should be 11 characters long', function(){
        chai.expect( 'Hello world' ).to.have.length( 11 );
    });
});
