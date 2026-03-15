class CrudService {
    constructor(repository) {
        this.repository = repository;
    }

    async create(data) {
        try {
            const result = await this.repository.create(data);
            console.log("Data created successfully");
            return result; 
        } catch (error) {
            console.log("Error creating data in CrudService: ", error);
            throw error;
        }
    }

    async findOne(data) {
        try {
            const result = await this.repository.findOne(data);
            return result;
        } catch (error) {
            console.log("Error finding data in CrudService: ", error);
            throw error;
        }
    }

    async findAll() {
        try {
            const result = await this.repository.findAll();
            return result;
        } catch (error) {
            console.log("Error finding data in CrudService: ", error);
            throw error;
        }
    }

    async update(filter, data) {
        try {
            const result = await this.repository.update(filter, data);
            console.log("Data updated successfully");
            return result;
        } catch (error) {
            console.log("Error updating data in CrudService: ", error);
            throw error;
        }
    }

    async delete(filter) {
        try {
            const result = await this.repository.delete(filter);
            console.log("Data deleted successfully");
            return result;
        } catch (error) {
            console.log("Error deleting data in CrudService: ", error);
            throw error;
        
        }
    }
}

module.exports = CrudService;