export interface ArtifactoryItem {
    repo: string	//The name of the repository in which this item is stored
    path: string	//The full path associated with this item
    name: string	//The name of the item
    created: Date	//When the item was created
    modified: Date	//File system timestamp indicating when the item was last modified
    updated: Date	//When the item was last uploaded to a repository.
    created_by: string	//The name of the item owner
    modified_by: string	//The name of the last user that modified the item
    type: 'file' | 'folder' | 'any'	//The item type (file/folder/any). If type is not specified in the query, the default type searched for is file depth	int	The depth of the item in the path from the root folder
    original_md5?: string	//The item's md5 hash code when it was originally uploaded
    actual_md5?: string	//The item's current md5 hash code
    original_sha1?: string	//The item's sha1 hash code when it was originally uploaded
    actual_sha1?: string	//The item's current sha1 hash code
    size: number	//The item's size on disk
    virtual_repos?: string	//The virtual repositories which contain the repository in which this item is stored.
}