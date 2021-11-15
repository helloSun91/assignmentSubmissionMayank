public with sharing class accountCreationController {
    public accountCreationController() {

    }

    @AuraEnabled(cacheable=true)
    public static Integer getAccountCount() {
    Integer accCount = [SELECT COUNT() FROM Account WHERE createdDate = today ];
    system.debug('accCount'+accCount);
    return accCount;
 }
}