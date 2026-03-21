class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const result = await this.model.create(data);
            console.log("Data created successfully", result);
            return result; 
        } catch (error) {
            console.log("Error creating data: ", error);
            throw error;
        }
    }

    async findOne(data) {
        try {
            const result = await this.model.findOne(data);
            return result;
        } catch (error) {
            console.log("Error finding data: ", error);
            throw error;
        }
    }

    async find(data) {
        try {
            const result = await this.model.find(data);
            return result;
        } catch (error) {
            console.log("Error finding data: ", error);
            throw error;
        }
    }

    async findAll() {
        try {
            const result = await this.model.find();
            return result;
        } catch (error) {
            console.log("Error finding data: ", error);
            throw error;
        }
    }

    async update(filter, data) {
        try {
            const result = await this.model.updateOne(filter, data);
            console.log("Data updated successfully");
            return result;
        } catch (error) {
            console.log("Error updating data: ", error);
            throw error;
        }
    }

    async delete(filter) {
        try {
            const result = await this.model.deleteOne(filter);
            console.log("Data deleted successfully");
            return result;
        } catch (error) {
            console.log("Error deleting data: ", error);
            throw error;
        
        }
    }
}

module.exports = CrudRepository;